export type PgResult = any;

export interface Logger {
    error(message: any, details?: any): void;
    warning(message: any, details?: any): void;
    info(message: any, details?: any): void;
    verbose(message: any, details?: any): void;
    debug(message: any, details?: any): void;
}

export type PgPoolStatistic = {
    totalCount: number,
    idleCount: number,
    waitingCount: number
};

export type PgClient = {
    query: (sql: string, parameters?: any[]) => Promise<PgResult>,
    release: () => void
};

export type PgPool = {
    connect: () => Promise<PgClient>,
    stat: () => PgPoolStatistic,
    drain: () => void
};

export type PgOptions = {
    connectionString?: string,
    applicationName?: string,
    queryTimeoutMillis?: number,
    statementTimeoutMillis?: number,
    connectionTimeoutMillis?: number,
    maxNumClients?: number,
    idleTimeoutMillis?: number,
    techBreakMillis?: number,
};

export declare function getPool(options?: PgOptions): PgPool;
export declare function verbose(logger: Logger, pool: PgPool): PgPool;
export declare function transactional(client: PgClient, task: () => Promise<any | void>, mode?: string): Promise<any | void>;
export declare function encodeId(identifier: string): string;
export declare function fetchAllRows(result: PgResult): any[];
export declare function fetchFirstColumn(result: PgResult): any | null;
export declare function fetchFirstRow(result: PgResult): any | null;
