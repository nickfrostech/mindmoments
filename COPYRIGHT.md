# Copyright and third-party notices

Unless a file says otherwise, the MindMoments project source and documentation
are copyright (c) 2026 MindMoments contributors and are distributed under the
[MIT License](./LICENSE).

This notice applies to this project's own contributions. It does not relicense
third-party software, services, illustrations, fonts, or model weights bundled
with or used by the project. Those remain subject to their own licenses and
terms.

## AI models and services

- **Gemma 2** is an open-weight model family from Google. Its weights are
  governed by the [Gemma Terms of Use](https://ai.google.dev/gemma/terms), not
  this repository's MIT License. See the [Gemma 2 9B Instruct model card](https://huggingface.co/google/gemma-2-9b-it)
  and the [Ollama Gemma 2 library entry](https://ollama.com/library/gemma2)
  for model-specific information.
- **Google Gemini API** is an optional hosted provider route in this project;
  it is a separate model/service and is not Gemma 2. Its use is governed by
  Google's applicable [Gemini API terms](https://ai.google.dev/gemini-api/terms).
- **Groq** is an optional hosted inference provider. Its service is governed
  by [Groq's terms](https://groq.com/terms-of-service/); the selected model's
  terms also apply.

## Third-party dependencies

Runtime and development dependencies are listed in [package.json](./package.json)
and [pnpm-lock.yaml](./pnpm-lock.yaml). Each dependency remains under its own
license. Consult the package's published license for the applicable terms.

If you believe a copyright or attribution notice is missing or incorrect,
please open an issue with the relevant file and details.
