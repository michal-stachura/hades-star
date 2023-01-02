import { CorporationDetails } from '@/types/corporation';

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails | undefined>('corporation', undefined)
  const wsReady = useState<number>('wsReady', () => 0)

  const getWsReady = () => {
    if (corporation.value?.members) {
      wsReady.value = corporation.value.members.reduce((counter, currObj) => currObj.nextWs === 'R' ? ++counter : counter, 0)
    } else {
      wsReady.value = 0
    }
  }

  const setWsStatus = (userId: string, status: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      corporation.value.members[memberIdx].nextWs = status
      getWsReady()
    }
  }
  
  const clearWsStatus = (userId: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      delete corporation.value.members[memberIdx].nextWs 
      getWsReady()
    }
  }

  return {
    corporation,
    wsReady,
    getWsReady,
    setWsStatus,
    clearWsStatus

  }
}

export default useCorporationDetails;