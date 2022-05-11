import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import {
    BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import * as strings from 'TestCustomizerFormCustomizerStrings';
import TestCustomizer, { ITestCustomizerProps } from './components/TestCustomizer';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITestCustomizerFormCustomizerProperties {
    // This is an example; replace with your own property
    sampleText?: string;
}

const LOG_SOURCE: string = 'TestCustomizerFormCustomizer';

export default class TestCustomizerFormCustomizer
    extends BaseFormCustomizer<ITestCustomizerFormCustomizerProperties> {

    private sp: SPFI = undefined;

    public onInit(): Promise<void> {
        // Add your custom initialization to this method. The framework will wait
        // for the returned promise to resolve before rendering the form.
        Log.info(LOG_SOURCE, 'Activated TestCustomizerFormCustomizer with properties:');
        Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
        this.sp = spfi().using(SPFx(this.context));
        return Promise.resolve();
    }

    public render(): void {
        // Use this method to perform your custom rendering.

        const testCustomizer: React.ReactElement<{}> =
            React.createElement(TestCustomizer, {
                sp: this.sp,
                //context: this.context,
                listGuid: this.context.list.guid,
                itemID: this.context.itemId,
                displayMode: this.displayMode,
                onSave: this._onSave,
                onClose: this._onClose
            } as ITestCustomizerProps);

        ReactDOM.render(testCustomizer, this.domElement);
    }

    public onDispose(): void {
        // This method should be used to free any resources that were allocated during rendering.
        ReactDOM.unmountComponentAtNode(this.domElement);
        super.onDispose();
    }

    private _onSave = (): void => {

        // You MUST call this.formSaved() after you save the form.
        this.formSaved();
    }

    private _onClose = (): void => {
        // You MUST call this.formClosed() after you close the form.
        this.formClosed();
    }
}
