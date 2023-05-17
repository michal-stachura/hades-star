import { WsLog } from "@/types/ws-log"
import { useToast } from "vue-toastification";

const useWsLogs = () => {
  const wsLogs = useState<WsLog[]>('wsLogs', () => [])
  
  const fetchWsLogs = async () => {
    console.log("fetch data")
    const config = useRuntimeConfig();

    await fetch(
      `${config.apiBaseUrl}/ws-logs/`,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then((responseJson) => {
      wsLogs.value = responseJson as WsLog[];
    }).catch((error) => {
      if (process.client) {
        useToast().error(`${error.status} - ${error.statusText}`)
      }
    })
  }

  return {
    wsLogs,
    fetchWsLogs
  }
}

export default useWsLogs