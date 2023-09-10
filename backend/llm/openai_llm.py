import os
from typing import List
import openai
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
if os.getenv('OPENAI_API_TYPE') == 'azure':
    from langchain.chat_models import AzureChatOpenAI
else:
    from langchain.chat_models import ChatOpenAI
from langchain.schema import BaseMessage, HumanMessage

from database.chroma import get_chroma
from llm.base import AsyncCallbackAudioHandler, \
    AsyncCallbackTextHandler, LLM, QuivrAgent, SearchAgent, MultiOnAgent
from logger import get_logger
from utils import Character
from openai.error import OpenAIError
from typing import Dict

logger = get_logger(__name__)


class OpenaiLlm(LLM):
    def __init__(self, model):
        if os.getenv('OPENAI_API_TYPE') == 'azure':
            self.chat_open_ai = AzureChatOpenAI(
                deployment_name=os.getenv(
                    'OPENAI_API_MODEL_DEPLOYMENT_NAME', 'gpt-35-turbo'),
                model=model,
                temperature=0.5,
                streaming=True
            )
        else:
            self.chat_open_ai = ChatOpenAI(
                model=model,
                temperature=0.5,
                streaming=True
            )
        self.config = {
            "model": model,
            "temperature": 0.5,
            "streaming": True
        }
        self.db = get_chroma()
        self.search_agent = SearchAgent()
        self.quivr_agent = QuivrAgent()
        self.multion_agent = MultiOnAgent()

    def get_config(self):
        return self.config

    async def achat(self,
                    history: List[BaseMessage],
                    user_input: str,
                    user_input_template: str,
                    callback: AsyncCallbackTextHandler,
                    audioCallback: AsyncCallbackAudioHandler,
                    character: Character,
                    useSearch: bool = False,
                    useQuivr: bool = False,
                    useMultiOn: bool = False,
                    quivrApiKey: str = None,
                    quivrBrainId: str = None,
                    metadata: dict = None,
                    *args, **kwargs) -> str:
        # 1. Generate context
        context = self._generate_context(user_input, character)
        # Get search result if enabled
        if useSearch:
            context += self.search_agent.search(user_input)
        if useQuivr and quivrApiKey is not None and quivrBrainId is not None:
            context += self.quivr_agent.question(
                user_input, quivrApiKey, quivrBrainId)
        if useMultiOn:
            if (user_input.lower().startswith("multi_on") or 
                user_input.lower().startswith("multion")):
                response = await self.multion_agent.action(user_input)
                context += response

        # 2. Add user input to history
        history.append(HumanMessage(content=user_input_template.format(
            context=context, query=user_input)))
        callbacks = [callback,StreamingStdOutCallbackHandler]
        if audioCallback is not None:
            callbacks.append(audioCallback)
        # 3. Generate response
        response = await self.chat_open_ai.agenerate(
            [history], callbacks=callbacks,
            metadata=metadata)
        logger.info(f'Response: {response}')
        return response.generations[0][0].text

    def _generate_context(self, query, character: Character) -> str:
        docs = self.db.similarity_search(query)
        docs = [d for d in docs if d.metadata['character_name'] == character.name]
        logger.info(f'Found {len(docs)} documents')

        context = '\n'.join([d.page_content for d in docs])
        return context



    async def achat_stream(self,
                    history: List[Dict],
                    user_input: str,
                    user_input_template: str,
                    character: Character,
                    useSearch: bool = False,
                    useQuivr: bool = False,
                    useMultiOn: bool = False,
                    quivrApiKey: str = None,
                    quivrBrainId: str = None,
                    *args, **kwargs) :
        try:
            # 1. Generate context
            context = self._generate_context(user_input, character)
            # Get search result if enabled
            if useSearch:
                context += self.search_agent.search(user_input)
            if useQuivr and quivrApiKey is not None and quivrBrainId is not None:
                context += self.quivr_agent.question(
                    user_input, quivrApiKey, quivrBrainId)
            if useMultiOn:
                if (user_input.lower().startswith("multi_on") or
                    user_input.lower().startswith("multion")):
                    response = await self.multion_agent.action(user_input)
                    context += response
            print(context)
            # 2. Add user input to history
            history.append({'role':"user","content":user_input_template.format(
                context=context, query=user_input)})
            openai.api_key = os.getenv("OPENAI_API_KEY")
            response = await openai.ChatCompletion.acreate(
                    model="gpt-4",
                    messages=history,
                    stream=True )
            async for chunk in response:
                content = chunk["choices"][0].get("delta", {}).get("content")
                if content is not None:
                    # print(content)
                    yield content
        except OpenAIError as e:
            yield f"{type(e).__name__}: {str(e)}"

