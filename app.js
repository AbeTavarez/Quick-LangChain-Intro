import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Model
const model = new ChatOpenAI({ model: "gpt-4o" });

// Parser
const parser = new StringOutputParser();

const app = express();
const PORT = 4000;

// middleware
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

app.post("/api/translate/:translateTo", async (req, res) => {
  try {
    // Prompt Template
    const systemTemplateMessage = "Translate the following to {language}";

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplateMessage],
      ["user", "{text}"],
    ]);

    // Chain
    const llmChain = promptTemplate.pipe(model).pipe(parser);

    // Result from the chain
    const result = await llmChain.invoke({language: req.params.translateTo, text: req.body.textToTranslate });
    
    console.log(result);

    res.json(result);

  } catch (e) {
    console.error(e);
  }
});
