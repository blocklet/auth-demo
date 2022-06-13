# Auth Demo Blocklet

Blocklet that use auth by Blocklet Server Auth Service

## Launch on Blocklet Server

[![Launch on Blocklet Server](https://assets.arcblock.io/icons/launch_on_blocklet_server.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2Fblocklet%2Fauth-demo%2Freleases%2Fdownload%2Fv1.4.8%2Fblocklet.json)

## Run and debug in the cloud with Gitpod

Click the "Open in Gitpod" button, Gitpod will start Blocklet Server and the blocklet.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/blocklet/auth-demo)

## Run and debug in local

```shell
yarn global add @blocklet/cli
git clone git@github.com:blocklet/auth-demo.git
cd auth-demo
cp .env.bac .env
yarn
blocklet server init -f --mode debug
blocklet server start
blocklet dev
```

## License

The code is licensed under the Apache 2.0 license found in the
[LICENSE](LICENSE) file.
