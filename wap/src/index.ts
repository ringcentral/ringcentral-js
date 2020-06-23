import SDK from '@ringcentral/sdk';

export default class Wap {
    private sdk: SDK;

    public constructor({sdk}: {sdk: SDK}) {
        this.sdk = sdk;
    }

    private interopCode = async clientId =>
        (await this.sdk.platform().post(`/restapi/v1.0/interop/generate-code`, {clientId})).json();

    // ATTENTION WEB APPS! Landing page has to be last parameter because HostSync will append additional path to it
    // Technically this and /interop/generate-code should be blended into one endpoint
    private launchProxy = ({url, code, clientId}) =>
        this.sdk
            .platform()
            .createUrl(`/apps/${clientId}/api/wap/launch?code=${code}&landing_page_uri=${encodeURIComponent(url)}`);

    public bootstrapApp = async ({url, clientId}) => {
        const {code} = await this.interopCode(clientId);
        return this.launchProxy({url, code, clientId}); // add # to URL enable hash history in IFRAME
    };
}
