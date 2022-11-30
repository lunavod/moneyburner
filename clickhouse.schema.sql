CREATE TABLE IF NOT EXISTS task_run_logs
(
    `Type` String,
    `Text` String,
    `TaskRunId` String,
    `Time` DateTime64(3),
    `Id` String
)
ENGINE = MergeTree
PRIMARY KEY Id
ORDER BY (Id, Time)
SETTINGS index_granularity = 8192;