import React, { useState, useEffect } from 'react';
// services
import {
    getCountOfPriorities,
} from '../../services/api';

import LogChat from '../Chart';
import FilterOptions from '../Filters';
import { Statistic, Col, Row, Card, Space } from 'antd';

const StatisticLogs = () => {

    const [ countOfPriorities, setCountOfPriorities ] = useState({
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
    });

    const getPriorities = async () => {
        const { success, prioritiesCount = null } = await getCountOfPriorities();
        if (success && prioritiesCount) {
            setCountOfPriorities(prioritiesCount)
        }
    };

    useEffect(() => {
        getPriorities();
    },[]);

    const style = { color: '#3f8600' };
    return (
        <>
        <Row gutter={16}>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic title="Urgent" valueStyle={style} value={countOfPriorities.urgent} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic title="High" valueStyle={style} value={countOfPriorities.high} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic title="Medium" valueStyle={style} value={countOfPriorities.medium} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic title="Low" valueStyle={style} value={countOfPriorities.low} />
                </Card>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Space>
                    <Card>
                        <FilterOptions layout="vertical" />
                    </Card>
                </Space>
            </Col>
            <Col span={10}>
                <LogChat />
            </Col>
        </Row>
        </>
    )
}

export default StatisticLogs;