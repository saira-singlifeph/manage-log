import React, { useState, useEffect } from 'react';
// services
import {
    getCountOfPriorities,
} from '../../services/api';
// Components
import LogChart from '../Chart';
import SelectedType from '../Selected Type';
import { getStatisticData } from '../../services/api';
import { Statistic, Col, Row, Card, Space } from 'antd';
import { 
        PRIORITIES as priorities,
        SOURCES as sources 
} from '../../constant/constant';

const Analytics = () => {

    const [ countOfPriorities, setCountOfPriorities ] = useState({
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
    });

    const [ fetchedLevels, setFetchedLevels ] = useState(sources);
    const [ statisticData, setStatisticData ] = useState([]);

    const getPriorities = async () => {
        const { success, prioritiesCount = [] } = await getCountOfPriorities();
        if (success && prioritiesCount) {
            setCountOfPriorities(prioritiesCount)
        }
    };


    const getChartData = async (selected = { priority: 'low' }) => {
        const { data = [] } = await getStatisticData(selected);
        if (data.length > 0) {
            const type = data.map(({ type }) => type);
            const logCounts = data.map(({ logs }) => logs);
            setFetchedLevels(type);
            setStatisticData(logCounts);
        }
        
    }

    useEffect(() => {
        getPriorities();
        getChartData();
    },[]);

    const countersData = [
        {
            title: 'Urgent',
            value: countOfPriorities.urgent
        },
        {
            title: 'High',
            value: countOfPriorities.high
        },
        {
            title: 'Medium',
            value: countOfPriorities.medium
        },
        {
            title: 'Low',
            value: countOfPriorities.low
        }
    ].map(({ title, value }) => {
        return(
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic title={title} valueStyle={{ color: '#3f8600' }} value={value} />
                </Card>
             </Col>
        )
    });

    const populateCharForm = [
        {
            options: priorities,
            label: 'Populate the chart by Priority Level:',
            type: 'priority',
            btnLabel: 'Apply Priority'
        },
        {
            options: sources,
            label: 'Populate the chart by Source:',
            type: 'source',
            btnLabel: 'Apply Source'
        }
    ].map((option) => {
        return <SelectedType {...option} onFinish={getChartData}/>
    })


    return (
        <>
        <Row gutter={16}>
            {countersData}
        </Row>
        <Row gutter={16}>
            <Col span={10}>
                <Space>
                    <Card> 
                        {populateCharForm}
                    </Card>
                </Space>
            </Col>
            <Col span={12}>
                <LogChart fetchedLevels={fetchedLevels} statisticData={statisticData} />
            </Col>
        </Row>
        </>
    )
}

export default Analytics;