# Desktop apps with Electron boilerplate

Thank you for buying the Desktop apps with Electron premium package.
This boilerplate is going to kickstart your next Electron app idea. 

It includes a ton of useful features out of the box:

* Tailwind CSS
* Autoupdater
* GitHub release distribution
* Offline License validation
* Global storage system (to persist settings, etc.)
* macOS notarization
* GitHub actions
* Error reporting

## Customization

Before you start building your app, you should customize a couple of placeholders in this boilerplate code:

1. Replace `your-app-name` in the `package.json` file with your application name.
2. Replace `your-app-id` with your application identifier in `vue.config.js` and `afterSignHook.js`
3. Replace `your-dsn-url` in the `src/background.js` and `src/main.js` if you want to make use of Sentry error reporting.



## Project setup

Run this command to install all necessary dependencies:

```
yarn install
```

## Start developing

To start developing your app, you can run:

```
yarn electron:serve
```

This will enable hot-reloading in your background- and renderer threads.

## Licensing

You can generate a new public and private keypair using: 

```
yarn electron:keypair
```

The private key file is **not** under version control, so you should keep it safe - otherwise you will not be able to generate new license keys for your application without having to invalidate existing keys!

### Generate keys

You can manually generate license keys using: 

```
yarn electron:license
```

## App Icon

You can change the default app icon, by placing a 1024x1024 pixel image inside the `appIcon` folder called `icon.png`. 

To regenerate your app icon, call:

```
yarn electron:icon
```