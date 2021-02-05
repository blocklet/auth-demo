# Auth Demo Blocklet

Blocklet that use auth by ABT Node Auth Service


<!-- ## Run and debug in the cloud with Gitpod -->
<!-- Click the "Open in Gitpod" button, Gitpod will start ABT Node and the blocklet. -->

<!-- [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/blocklet/wallet-playground) -->

## Run and debug in local

```shell
yarn global add @abtnode/cli
git clone git@github.com:blocklet/auth-demo.git
cd auth-demo
cp .env.bac .env
yarn
abtnode init -f --mode debug
abtnode start
blocklet dev
```

## License

The code is licensed under the Apache 2.0 license found in the
[LICENSE](LICENSE) file.
