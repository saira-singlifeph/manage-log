import React, { useEffect, useState } from 'react';
import moment from 'moment';
// component
import Log from '../Log';
import CreateLog from '../Create Log';
import FilterOptions from '../Filters';
import SearchBar from '../Search Bar';

// services
import { 
    getLogs, 
    getLogById, 
    deleteLogById, 
    updateLogById,
    createLog,
    queryLogs
} from '../../services/api';

import { 
    Table, 
    Button, 
    Modal, 
    Space,
    Col, 
    Row,
} from 'antd';


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

    const [ searchText, setSearchText ] = useState(null);

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
       setIsFetchingDetails(false);
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
        setIsReadyOnly(!isReadyOnly);
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


    const handleQueries = async({ level, source = null, range = [] }) => {
        let queryPayload = {
            level,
            source,
        };

        if (range.length) {
            const fromDate = range[0].format("YYYY-MM-DD");
            const toDate = range[1].format("YYYY-MM-DD")

            queryPayload = {
                ...queryPayload,
                fromDate,
                toDate
            }
        }

         // add loading icon to the table to indicate the querying started
         setLoading(true);
         const { result = [] } = await queryLogs(queryPayload);
         setLoading(false);
         setLogs(result);       
    }

    const handleSearchBar = async (logName) => {
        if (logName) {
            setLoading(true);
            setSearchText(logName)
            const { result = [] } = await queryLogs({ logName });
            setLoading(false);
            setLogs(result);
        } else {
            fetchLogs();
        }
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
            render: (created_at) => moment(created_at).format("MM-DD-YYYY hh:mm:ss")
        },
        {
            title: 'Date Updated',
            dataIndex: 'updated_at',
            sorter: (a, b) => a.created_at.localeCompare(b.created_at),
            sortDirections: ['descend', 'ascend'],
            render: (created_at) => moment(created_at).format("MM-DD-YYYY hh:mm:ss")
        },
        {
            title: "Action",
            key: "action",
            render: (log) => (
                <>
                    <Button type="primary" onClick={()=> fetchLogDetails(log.id)}>View</Button>
                    <Button type="text" onClick={()=> deleteLog(log)}>Delete</Button>
                </>
            )
        }
    ]

    useEffect(() =>{
        fetchLogs();
    }, []);

    return(
        <>
        <Row>
            <Col span={24}>
            <Space
                style={{
                marginBottom: 16,
                }}
            >
                <Button type="primary" onClick={openCreateLogModal}>Create Log</Button>
                <Button type="primary" onClick={fetchLogs}>Reload Logs</Button>
            </Space>
            </Col>
        </Row>
        <Row>
            <Col>
                <FilterOptions handleQueries={handleQueries}/>
            </Col>
            <Col>
                <SearchBar searcText={searchText} handleSearchBar={handleSearchBar} />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
            <Table 
                columns={columns} 
                dataSource={logs} 
                hasData={logs.length} 
                loading={loading}
                rowKey={(logs) => logs.id}
        />
            </Col>
        </Row>
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