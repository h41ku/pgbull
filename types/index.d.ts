import pg from 'pg'

export interface Logger {
    error(message: any, details?: any): void;
    warning(message: any, details?: any): void;
    info(message: any, details?: any): void;
    verbose(message: any, details?: any): void;
    debug(message: any, details?: any): void;
};

export type PgPoolStatistic = {
    totalCount: number,
    idleCount: number,
    waitingCount: number
};

export type PgClient = {
    query: (sql: string, parameters?: any[]) => Promise<pg.Result>,
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
export declare function transactional(client: PgClient, task: () => Promise<any | void>, mode?: string): PgPool;
export declare function encodeId(identifier: string): string;
export declare function fetchAllRows(result: pg.Result): any[];
export declare function fetchFirstColumn(result: pg.Result): any | null;
export declare function fetchFirstRow(result: pg.Result): any | null;
