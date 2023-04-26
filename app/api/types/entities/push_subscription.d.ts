declare namespace Entity {
    type Alerts = {
        follow: boolean;
        favourite: boolean;
        mention: boolean;
        reblog: boolean;
        poll: boolean;
    };
    type PushSubscription = {
        id: string;
        endpoint: string;
        server_key: string;
        alerts: Alerts;
    };
}
