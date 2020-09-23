import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import RequestList from "./RequestList";
import LogDetail from "./LogDetail";
import CenteredPaper from "../CenteredPaper";

const HTTP_REQUEST_LOGS = gql`
  query HttpRequestLogs {
    httpRequestLogs {
      id
      method
      url
      timestamp
      response {
        status
        statusCode
      }
    }
  }
`;

function LogsOverview(): JSX.Element {
  const { loading, error, data } = useQuery(HTTP_REQUEST_LOGS);

  const [detailReqLogId, setDetailReqLogId] = useState<string | null>(null);
  const handleLogClick = (reqId: string) => setDetailReqLogId(reqId);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Alert severity="error">Error fetching logs: {error.message}</Alert>;
  }

  const { httpRequestLogs: logs } = data;

  return (
    <div>
      <Box mb={2}>
        <RequestList logs={logs} onLogClick={handleLogClick} />
      </Box>
      <Box>
        {detailReqLogId && <LogDetail requestId={detailReqLogId} />}
        {logs.length !== 0 && !detailReqLogId && (
          <CenteredPaper>
            <Typography>Select a log entry…</Typography>
          </CenteredPaper>
        )}
      </Box>
    </div>
  );
}

export default LogsOverview;
