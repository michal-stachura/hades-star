import { CorporationDetails } from '@/types/corporation';

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails | null>('corporation')

  const setCorporationDetails = (data: CorporationDetails) => {
    corporation.value = data
  }

  const countMembers = (statuses: string[]) => {
    if (statuses.length > 0) {
      return corporation.value?.members?.reduce((counter, currObj) => statuses.includes(currObj.nextWs) ? ++counter : counter, 0) || 0
    }
    return corporation.value?.members?.length || 0
  }

  const setWsStatus = (userId: string, status: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      corporation.value.members[memberIdx].nextWs = status
    }
  }

  const getWsStatus = (userId: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      return corporation.value.members[memberIdx].nextWs
    }
  }

  const getCorporationSecret = (corporationId: string):string => {
    let corporationSecret = '';
    if (process.client) {
      corporationSecret = localStorage.getItem(corporationId) || '';
      if (corporationSecret !== '') {
        corporationSecret = JSON.parse(corporationSecret).secret || '';
      }
    }
    return corporationSecret;
  }

  const setCorporationSecret = (secret: String, corporationId: String) => {
    localStorage.setItem(corporationId.toString(), JSON.stringify({secret: secret}))
  }

  return {
    corporation,
    setCorporationDetails,
    setWsStatus,
    getWsStatus,
    countMembers,
    getCorporationSecret,
    setCorporationSecret
  }
}

export default useCorporationDetails;