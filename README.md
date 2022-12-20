# VŠB E-Ink - Gateway

The repository contains the source code for the gateway of the VŠB E-Ink project. EInk-Gateway is a service, which stands between the E-Ink panels and the rest of the project's infrastructure. It is supposed to be a thin layer, with minimum logic. **However**, as the project is still in its early stages, the gateway is the only service, which is able to communicate with the panels. Therefore, it is currently also responsible for graphics processing coming to the panels and as a public API.

## Installation

For a production like environment, the easiest way to install the gateway is to use the provided Docker image. The image is available on [GitHub Container Registry](https://github.com/tajnymag/vsb-eink-gateway/pkgs/container/vsb-eink-gateway). The image is based on the [Alpine Linux](https://alpine-linux.org/) distribution and contains only the necessary packages to run the service. The image is built automatically on every push to the `master` branch. Versioning is yet to be implemented.

### Local development requirements

#### Necessary external packages

* Node.js 18+
* pnpm 7+

#### Steps to build and run locally

1. Clone the repository
2. Install the dependencies using `pnpm install`
3. Build the project using `pnpm build`
4. Run the project using `pnpm start` or directly using `node dist/bin.js`

## Running

The gateway can be configured using environment variables. The following variables are available:

| Variable           | Description                                                     | Default | Required |
| ------------------ |-----------------------------------------------------------------| ------- | -------- |
| PORT               | Port on which the service will listen on                        | 8080    | No       |
| HOST               | Host on which the service will listen on                        | 0.0.0.0 | No       |
| ADMIN_API_KEY_HASH | SHA256 hash of the admin API key, this **needs** to be provided | -       | Yes      |

## Using 

The public facing API is yet to be documented, but there is an official E-Ink Gateway API CLI client, which can be used to interact with the gateway. The client is available in its own GitHub [repository](https://github.com/tajnymag/vsb-eink-gateway-cli).
