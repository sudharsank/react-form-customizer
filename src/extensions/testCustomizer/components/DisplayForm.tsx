import * as React from 'react';
import { useEffect, useState, FC } from 'react';
import { SPFI } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Guid } from '@microsoft/sp-core-library';
import { Label } from 'office-ui-fabric-react/lib/Label';

export interface IDisplayFormProps {
    sp: SPFI;
    listGuid: Guid;
    itemId: number;
    onClose: () => void;
}

const DisplayForm: FC<IDisplayFormProps> = (props) => {
    const [title, setTitle] = useState<string>('');

    const populateItemForDisplay = async () => {
        let itemToUpdate: any = await props.sp.web.lists.getById(props.listGuid.toString()).items
            .select('ID', 'Title')
            .getById(props.itemId)();
        if (itemToUpdate) {
            setTitle(itemToUpdate?.Title);
        }
    };

    useEffect(() => {
        populateItemForDisplay();
    }, []);

    return (
        <React.Fragment>
            <div>Display Form</div>
            <div style={{ margin: '10px' }}>
                <b>Title: </b>&nbsp;<Label>{title}</Label>
            </div>
        </React.Fragment>
    );
};

export default DisplayForm;