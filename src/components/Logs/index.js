import React, { useEffect, useState } from 'react';
import moment from 'moment';
// component
import Log from '../Log';
import CreateLog from '../Create Log';
import FilterOptions from '../Filters';

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

import { 
    SOURCES as sources
} from '../../constant/constant';

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

    // Queries
    const [ queryPriority, setQueryPriority ] = useState(null);
    const [ querySources, setQuerySources ] = useState(null);
    // const dateToday = moment().format("YYYY-MM-DD");
    // const [ queryFromDate, setQueryFromDate ] = useState(dateToday);
    // const [ queryToDate, setQueryToDate ] = useState(dateToday);

    const fetchLogs = async() => {
        setLoading(true);
        const { success, logs } = await getLogs();
        if (success) {
            setLogs(logs);
        }
        setLoading(false);
        setQueryPriority(null);
        setQuerySources(null);
        // setQueryFromDate(null);
        // setQueryToDate(null);
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


    const handleQueries = async(queryData) => {
        console.log('queryData', queryData)
        const { 
            level = queryPriority, 
            // dates = [], 
            source = null,
        } = queryData;
        const payload = { level };


        if (!level) {
            fetchLogs();
        } else {
            setQueryPriority(level);

            if (sources) {
                payload.source = source;
                setQuerySources(source);
            }

    
            setLoading(true);
            const { result = [] } = await queryLogs(payload)
            
            setLogs(result);
            setLoading(false);
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
                <FilterOptions queryPriority={queryPriority} handleQueries={handleQueries}/>
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