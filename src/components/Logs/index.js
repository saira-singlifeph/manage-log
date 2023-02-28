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
import { FileExcelFilled } from '@ant-design/icons';

import { CSVLink } from 'react-csv';
import { CSV_HEADERS, DATE_FORM, DIRECTIONS } from '../../constant/constant';

const { confirm } = Modal;
 

const Logs = () => {

    const [ logs, setLogs ] = useState([]);

    const [ csvLogs, setCSVlogs ] = useState([]);
    const [ loading,  setLoading] = useState(false);

    const [ isFetchingDetails, setIsFetchingDetails ] = useState(false);
    const [ logDetails, setLogDetails ] = useState(null);
    const [ viewDetails, setViewDetails] = useState(false);

    const [ isEditLogDetails, setIsEditLogDetails ] = useState(false);
    const [ isUpdating, setIsUpdating] = useState(false);
    
    const [ isCreateFormOpen, setIsCreateFormOpen ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);
    const [ isInputReadyOnly, setIsInputReadyOnly ] = useState(true);

    const [ searchText, setSearchText ] = useState(null);

    const downloadLogs = () => {
        const data = logs.map((log) => {
            return {
                'log_name': log.log_name, 
                'message': log.message, 
                'priority': log.priority,
                'source': log.source,
                'created_at': log.created_at,
                'updated_at': log.updated_at
            } 
        });
        setCSVlogs(data)
        return null;
    };

    const fetchLogs = async() => {
        setLoading(true);
        const { success, logs } = await getLogs();
        if (success) {
            setLogs(logs);
        }
        setLoading(false);
    };

    const closeEditDetailsForm = () => {
        setViewDetails(false);
        setLogDetails(null);
        setIsEditLogDetails(false);
        setIsInputReadyOnly(true);
    };

    const openEditDetailsForm = () => {
        setIsEditLogDetails(!isEditLogDetails);
        setIsInputReadyOnly(!isInputReadyOnly);
    }

    const fetchLogDetails = async(id) => {
        setIsFetchingDetails(true)
        setViewDetails(true);
        const {
            success, log
        } = await getLogById(id);
       if (success) {
        setLogDetails(log);
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
          }
        });
    };
    
    const handleLogUpdate = async(details) => {
        // Indicate the updating of data
        setIsUpdating(true);
        await updateLogById(details);

        // reset
        setIsUpdating(false);
        setIsEditLogDetails(false);
        setIsInputReadyOnly(true)

         // re-fetch logs to get the update list
         fetchLogs();
    };

    const openCreateLogModal = () => {
        setIsCreateFormOpen(!isCreateFormOpen);
        setIsInputReadyOnly(!isInputReadyOnly);
    }

    const handleCreateLog = async(newLog) => {
        // indicate creating log
        setIsCreating(true);
        const { success } = await createLog(newLog);
        if (success) {
            fetchLogs();
            setIsCreateFormOpen(false);
            setIsInputReadyOnly(true);
        }
        setIsCreating(false);
    }


    const handleQueries = async({ level, source = null, range = [] }) => {
        let queryPayload = {
            level,
            source,
        };

        if (range && range.length > 0) {
            const format = 'YYYY-MM-DD';
            const fromDate = range[0].format(format);
            const toDate = range[1].format(format);

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
            return null;
        }
        fetchLogs();
        return null;
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
            sortDirections: DIRECTIONS,
        },
        {
            title: 'Source',
            dataIndex: 'source',
            sorter: (a, b) => a.source.localeCompare(b.source),
            sortDirections: DIRECTIONS,
        },
        {
            title: 'Date Created',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => a.created_at.localeCompare(b.created_at),
            sortDirections: DIRECTIONS,
            render: (created_at) => moment(created_at).format(DATE_FORM)
        },
        {
            title: 'Date Updated',
            dataIndex: 'updated_at',
            sorter: (a, b) => a.created_at.localeCompare(b.created_at),
            sortDirections: DIRECTIONS,
            render: (created_at) => moment(created_at).format(DATE_FORM)
        },
        {
            title: 'Action',
            key: 'action',
            render: (log) => (
                <>
                    <Button type='primary' onClick={()=> fetchLogDetails(log.id)}>View</Button>
                    <Button type='text' onClick={()=> deleteLog(log)}>Delete</Button>
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
                <Button type='primary' onClick={openCreateLogModal}>Create Log</Button>
                <Button type='primary' onClick={fetchLogs}>Reload Logs</Button>
                <CSVLink
                        data={csvLogs} 
                        headers={CSV_HEADERS}
                        onClick={downloadLogs}
                        filename={`logs-${moment().format('YYYYMMDDHHMMSS')}.csv`}
                    >
                    <Button><FileExcelFilled />Download</Button>
                </CSVLink>
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
            onClose={closeEditDetailsForm}
            isEdit={isEditLogDetails}
            onEdit={openEditDetailsForm}
            handleLogUpdate={handleLogUpdate}
            isUpdating={isUpdating}
            isInputReadyOnly={isInputReadyOnly}
        />
        <CreateLog 
            isCreateLog={isCreateFormOpen} 
            handleCreateLog={handleCreateLog}
            openCreateLogModal={openCreateLogModal}
            isInputReadyOnly={isInputReadyOnly}
            isCreating={isCreating}
        />
        </>
    );
}

export default Logs