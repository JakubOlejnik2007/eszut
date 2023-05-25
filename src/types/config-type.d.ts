export type TConfigData = {
    express: {
        port: Number;
    };
    MongoDB: {
        host: String;
        port: Number;
        name: String;
    };
    mail: {
        service: string;
        user: string;
        pass: string;
    };
    vapid: {
        public: String;
        private: String;
    };
};
