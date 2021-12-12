class PageRejection {
    reject(props, notif) {
        props.displayNotification(props.notify, notif.text, notif.color);
        props.history.push('/app/dashboard');
    }
}
export default new PageRejection();