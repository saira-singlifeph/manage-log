import React, { useEffect, useState } from 'react';
import moment from 'moment';
// component
import Log from '../Log';
import CreateLog from '../Create Log';

// services
import { 
    getLogs, 
    getLogById, 
    deleteLogById, 
    updateLogById,
    createLog, 
} from '../../services/api';

import { Table, Button, Modal, Space } from 'antd';

const { confirm } = Modal;
const Logs = () => {

    const [ logs, setLogs ] = useState([]);
    const [ loading,  setLoading] = useState(false);

    const [ isFetchingDetails, setIsFetchingDetails ] = useState(false);
    const [ logDetails, setLogDetails ] = useState(null);
    const [ viewDetails, setViewDetails] = useState(false);

    const [ isEdit, setIsEdit] = useState(false);
    const [ isUpdating, setIsUpdating] = useState(false);
    
    // open create log modal
    // TO DO: Rename
    const [ isCreateLog, setIsCreateLog ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);
    const [ isReadyOnly, setIsReadyOnly ] = useState(true);



    const fetchLogs = async() => {
        setLoading(true);
        const { success, logs } = await getLogs();
        if (success) {
            setLogs(logs);
        }
        setLoading(false);
    };

    // TODO: EDIT FUNCTION NAME
    const onClose = () => {
        setViewDetails(false);
        setLogDetails(null);
        setIsEdit(false);
        setIsReadyOnly(true);
    };

    // TODO: EDIT FUNCTION NAME
    const onEdit = () => {
        setIsEdit(!isEdit);
        setIsReadyOnly(!isReadyOnly)
    }

    const fetchLogDetails = async(id) => {
        setIsFetchingDetails(true)
        setViewDetails(true);
        const {
            success, log
        } = await getLogById(id);
       if (success) {
        setLogDetails(log)
       }
       setIsFetchingDetails(false)
    };

    const deleteLog = ({ log_name, id }) => {
        confirm({
          title: `Do you want to delete log name ${log_name}?`,
          async onOk() {
            const isDelete = await deleteLogById(id);
            fetchLogs();
            return isDelete;
          },
          onCancel() {
            // DO NOTHING
          },
        });
    };
    
    const handleLogUpdate = async(details) => {
        // Indicate the updating of data
        setIsUpdating(true);
        const isUpdated = await updateLogById(details);

        // reset
        setIsUpdating(false);
        setIsEdit(false);
        setIsReadyOnly(true)

        // re-fetch logs to get the update list
        fetchLogs();

         // TODO: ADD NOTIFICATION
        return isUpdated.success;
    };

    const openCreateLogModal = () => {
        setIsCreateLog(!isCreateLog);
        setIsReadyOnly(false);
    }

    const handleCreateLog = async(newLog) => {
        // indicate creating log
        setIsCreating(true);
        const { success } = await createLog(newLog);
        if (success) {
            fetchLogs();
            setIsCreateLog(false);
            setIsReadyOnly(true);
        }
        setIsCreating(false);
        // TODO: ADD NOTIFICATION IF ERROR
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'log_name',
            key: 'log_name',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            sorter: (a, b) => a.priority.localeCompare(b.priority),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Source',
            dataIndex: 'source',
            sorter: (a, b) => a.source.localeCompare(b.source),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Date Created',
            dataIndex: 'created_at',
            sorter: (a, b) => a.created_at.localeCompare(b.created_at),
            sortDirections: ['descend', 'ascend'],
            render: (created_at) => moment(created_at).format("MMM DD, YYYY hh:mm:ss")
        },
        {
            title: "Action",
            key: "id",
            render: (log) => (
                <>
                    <Button  id={log.id} type="primary" onClick={()=> fetchLogDetails(log.id)}>View</Button>
                    <Button  id={log.id} type="text" onClick={()=> deleteLog(log)}>Delete</Button>
                </>
            )
        }
    ]


    useEffect(() =>{
        fetchLogs();
    }, []);

    return(
        <>
        <Space
            style={{
            marginBottom: 16,
            }}
        >
            <Button type="primary" onClick={openCreateLogModal}>Create Log</Button>
            <Button type="primary" onClick={fetchLogs}>Reload Logs</Button>
        </Space>
        <Table 
            columns={columns} 
            dataSource={logs} 
            hasData={logs.length} 
            loading={loading} 
        />
        <Log 
            logDetails={logDetails} 
            isOpen={viewDetails} 
            loading={isFetchingDetails} 
            onClose={onClose}
            isEdit={isEdit}
            onEdit={onEdit}
            handleLogUpdate={handleLogUpdate}
            isUpdating={isUpdating}
            isInputReadyOnly={isReadyOnly}
        />
        <CreateLog 
            isCreateLog={isCreateLog} 
            handleCreateLog={handleCreateLog}
            openCreateLogModal={openCreateLogModal}
            isInputReadyOnly={isReadyOnly}
            isCreating={isCreating}
        />
        </>
    );
}

export default Logs