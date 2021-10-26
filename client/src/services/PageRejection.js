class PageRejection {
    reject(props, notif) {
        props.displayNotification(props.notify, notif.text, notif.color);
        props.history.push('/dashboard');
    }
}
export default new PageRejection();