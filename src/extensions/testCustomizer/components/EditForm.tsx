import * as React from 'react';
import { useEffect, useState, FC } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { SPFI } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Guid } from '@microsoft/sp-core-library';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IEditFormProps {
    sp: SPFI;
    listGuid: Guid;
    itemId: number;
    onSave: () => void;
    onClose: () => void;
}

const EditForm: FC<IEditFormProps> = (props) => {
    const [title, setTitle] = useState<string>('');
    const [msg, setMsg] = useState<any>(undefined);

    const saveListItem = async () => {
        await props.sp.web.lists.getById(props.listGuid.toString()).items.getById(props.itemId).update({
            Title: title
        });
        setMsg({ scope: MessageBarType.success, Message: 'Save successfull!' });
    };

    const populateItemForEdit = async () => {
        if (props.itemId) {
            let itemToUpdate: any = await props.sp.web.lists.getById(props.listGuid.toString()).items
                .select('ID', 'Title')
                .getById(props.itemId)();
            if (itemToUpdate) {
                setTitle(itemToUpdate?.Title);
            }
        } else {
            setMsg({ scope: MessageBarType.error, Message: 'Sorry, item not found!' });
        }
    };

    useEffect(() => {
        populateItemForEdit();
    }, []);

    return (
        <React.Fragment>
            <div>Edit Form</div>
            <div style={{ margin: '10px' }}>
                <TextField label="Enter Title:" value={title} onChange={(e, v) => setTitle(v)} />
                <PrimaryButton text="Save" onClick={saveListItem} />
            </div>
            {msg && msg.Message &&
                <MessageBar messageBarType={msg.scope ? msg.scope : MessageBarType.info}>{msg.Message}</MessageBar>
            }
        </React.Fragment>
    );
};

export default EditForm;