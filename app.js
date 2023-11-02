// Inspired by https://huggingface.co/spaces/huggingfacejs/text-generation-Mistral-7B-Instruct

import { HfInference } from '@huggingface/inference'


async function* textStreamRes(hf, controller, input) {
  let tokens = [];
  for await (const output of hf.textGenerationStream(
    {
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: input,
      parameters: { max_new_tokens: 1000 },
    },
    {
      use_cache: false,
      signal: controller.signal,
    }
  )) {
    tokens.push(output);
    yield tokens;
  }
}

let controller;
async function run() {
  controller = new AbortController();
  const message = `<s>[INST]{:}[/INST]`;
  const textInput = 'Why is the sky blue?';
  const input = message.replace("{:}", textInput);
  const token = '';
  const hf = new HfInference(token);

  try {
    for await (const tokens of textStreamRes(hf, controller, input)) {
      const lastToken = tokens[tokens.length - 1];
      process.stdout.write(lastToken.token.text);
    }
    console.log(); // newline
  } catch (e) {
    console.log("aborted");
  }
}


run();

