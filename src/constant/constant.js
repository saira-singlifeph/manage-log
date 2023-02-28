export const PRIORITIES = ['urgent', 'high', 'medium', 'low'];
export const SOURCES = ['unknown', 'customer', 'internal', 'other'];

export const CSV_HEADERS = [
    {
        label: 'Log Name',
        key: 'log_name',
    },
    {
        label: 'Message',
        key: 'message',
    },
    {
        label: 'Priority',
        key: 'priority',
    },
    {
        label: 'Source',
        key: 'source',
    },
    {
        label: 'Created At',
        key: 'created_at'
    },
     {
        label: 'Updated At',
        key: 'updated_at'
    }
];

export const DATE_FORM = 'MM-DD-YYYY hh:mm:ss';
export const DIRECTIONS = ['descend', 'ascend'];