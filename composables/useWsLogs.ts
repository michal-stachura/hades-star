import { WsLog } from "@/types/ws-log"
import { useToast } from "vue-toastification";

const useWsLogs = () => {
  const wsLogs = useState<WsLog[]>('wsLogs', () => [])
  
  const fetchWsLogs = async () => {
    const config = useRuntimeConfig();

    const { data, error, pending} = await useFetch(
      `${config.apiBaseUrl}/ws-logs/`
    )

    if (data.value) {
      wsLogs.value = data.value as WsLog[];
    }
    if (error.value) {
      useToast().error(`${error.value.status} - ${error.value.statusText}`)
    }
  }

  return {
    wsLogs,
    fetchWsLogs
  }
}

export default useWsLogs