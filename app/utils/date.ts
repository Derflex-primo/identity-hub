const deogracias = new Date();

const date = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
}).format(deogracias);

export default date