import { CorporationDetails } from '@/types/corporation';
import { Member } from '@/types/member';
import { Condition, Filter } from '@/types/filter';
import { ShipAttribute } from '@/types/ship-attribute';
import * as pkg from "vue-toastification"
const { useToast } = pkg

function attributeGroup(filterId: string): keyof ShipAttribute {
  const weaponIds = ['BATTERY', 'LASER', 'MASS_BATTERY', 'DUAL_LASER', 'BARRAGE', 'DART_LAUNCHER'];
  const shieldIds = ['DELTA_SHIELD', 'PASSIVE_SHIELD', 'OMEGA_SHIELD', 'MIRROR_SHIELD', 'BLAST_SHIELD', 'AREA_SHIELD'];
  const miningIds = ["MINING_BOOST", "HYDROGEN_BAY_EXTENSION", "ENRICH", "REMOTE_MINING", "HYDROGEN_UPLOAD", "MINING_UNITY","CRUNCH", "GENESIS", "HYDROGEN_ROCKET", "MINING_DRONE"];
  const supportIds = ["EMP", "TELEPORT", "RED_STAR_LIFE_EXTENDER", "REMOTE_REPAIR", "TIME_WRAP", "UNITY", "SANCTUARY", "STEALTH", "FORTIFY", "IMPULSE", "ALPHA_ROCKET","SALVAGE", "SUPRESS", "DESTINY", "BARRIER", "VENEGANCE", "DELTA_ROCKET", "LEAP", "BOND", "LASER_TURRET", "ALPHA_DRONE", "SUSPEND", "OMEGA_ROCKET", "REMOTE_BOMB"];
  const tradeIds = ["CARGO_BAY_EXTENSION", "SHIPMENT_COMPUTER", "TRADE_BOOST", "RUSH", "TRADE_BURST", "SHIPMENT_DRONE", "OFFLOAD", "SHIPMENT_BEAM", "ENTRUST", "DISPATCH", "RECALL", "RELIC_DRONE"];
  
  let strKeyName: keyof ShipAttribute = 'weapon'
  if (weaponIds.includes(filterId)) {
    strKeyName = 'weapon'
  } else if (shieldIds.includes(filterId)) {
    strKeyName = 'shield'
  } else if (miningIds.includes(filterId)) {
    strKeyName = 'mining'
  } else if (supportIds.includes(filterId)) {
    strKeyName = 'support'
  } else if (tradeIds.includes(filterId)) {
    strKeyName = 'trade'
  } 
  return strKeyName
}

function setCorporationLocalStorage(corporationId: string, corporationData: any = {} ): void {
  if (process.client) {
    if (!localStorage.getItem('hadesWS')) {
      // Create base object if not exists
      localStorage.setItem('hadesWS', JSON.stringify({appSettings: {}, corporations: {}}))
    }
    const lStorage = localStorage.getItem('hadesWS');

    if (lStorage) {
      let lStorageJson = JSON.parse(lStorage);
      
      // Add or update corporation to local storage object
      lStorageJson.corporations[corporationId] = corporationData
      
      localStorage.setItem('hadesWS', JSON.stringify(lStorageJson))
    }
  }
}

function getCorporationLocalStorageData(id: string): any | null {
  if (process.client) {
    const lStorage = localStorage.getItem('hadesWS');
    if (lStorage) {
      const lStorageJson = JSON.parse(lStorage);
      if (lStorageJson.corporations.hasOwnProperty(id)) {
        return lStorageJson.corporations[id]
      }
    }
  }
  return null
}

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails | null>('corporation');
  const loadingCorporation = useState<boolean>('loadingCorporation', () => true);
  const incorrectSecret = useState<boolean>('incorrectSecret', () => false);
  const currentCorporationId = useState<string>('currentCorporationId', () => '');

  const fetchCorporationData = async (corporationId: string) => {
    const config = useRuntimeConfig();
    corporation.value = null;
    loadingCorporation.value = true;

    await fetch(
      `${config.apiBaseUrl}/corporations/${corporationId}/`,
      {
        headers: [['Corporation-Secret', getCorporationSecret(corporationId)]],
      }
    ).then((response) => {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response);
    }).then((responseJson) => {
      setCorporationDetails(responseJson as CorporationDetails)
      loadingCorporation.value = false;
      incorrectSecret.value = false;
    }).catch((error) => {
      if (process.client) {
        useToast().error(`${error.status} - ${error.statusText}`)
      }
      loadingCorporation.value = false;
      if (error.status === 403) {
        incorrectSecret.value = true;
      }
    })
  }

  const setCorporationDetails = (data: CorporationDetails) => {
    corporation.value = data;
    sortMembersByName();
  }

  const countMembers = (wsStatuses: string[]) => {
    if (wsStatuses.length > 0) {
      return corporation.value?.members?.reduce((counter, currObj) => wsStatuses.includes(currObj.nextWs) ? ++counter : counter, 0) || 0
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

  const getCorporationSecret = (corporationId: string): string => {
    const corpData = getCorporationLocalStorageData(corporationId)
    if (corpData && corpData.hasOwnProperty('secret')) {
      return corpData.secret;
    } else {
      return '';
    }
  }

  const setCorporationSecret = (secret: string, corporationId: string) => {
    let corpData = getCorporationLocalStorageData(corporationId)
    if (!corpData) {
      setCorporationLocalStorage(corporationId, {secret: secret})
    } else {
      corpData.secret = secret;
      setCorporationLocalStorage(corporationId, corpData)
    }
  }

  const addCorporationMember = (member: Member) => {
    if (corporation.value && corporation.value.members) {
      corporation.value.members.push(member);
      sortMembersByName();
    }
  }
  
  
  const updateCorporationMember = (member: Member) => {
    if (corporation.value && corporation.value.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === member.id);
      corporation.value.members[memberIdx] = member;
    }
  }

  const deleteCorporationMember = (memberId: string) => {
    if (corporation.value && corporation.value.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === memberId)
      if (memberIdx > -1) {
        corporation.value.members.splice(memberIdx, 1);
      }
    }
  }

  const addCorporationFilter = (filter: Filter): void => {
    if (corporation.value && corporation.value.filters) {
      corporation.value.filters.push(filter);
      sortFiltersByName();
    }
  }

  const deleteCorporationFilter = (filterId: string) => {
    if (corporation.value && corporation.value.filters) {
      const filterIdx = corporation.value.filters.findIndex(obj => obj.id === filterId)
      if (filterIdx > -1) {
        corporation.value.filters.splice(filterIdx, 1);
      }
    }
  }

  const hideMembersWithWsStatus = (wsStatuses: string[]) => {
    if (corporation.value?.members) {
      let afterFiltering = []
      if (wsStatuses.length > 0) {
        afterFiltering = corporation.value.members.map(m => wsStatuses.includes(m.nextWs) ? {...m, isVisible: true} : {...m,  isVisible: false})
      } else {
        afterFiltering = corporation.value.members.map(m => {return {...m, isVisible: true}})
      }
      corporation.value.members = afterFiltering
    }
  }

  const filterMembersByTechLevel = (conditions: Condition[]): void => {
    if (corporation.value?.members) {
      let afterFiltering = []      
      
      if (conditions.length > 0) {
        let filteredMembers: Member[] | undefined = []
        conditions.forEach(condition => {
          const attributeGroupName = attributeGroup(condition.id)
          if (condition.type === 'lower') {
            filteredMembers = corporation.value?.members.filter(
              member => member.attributes[attributeGroupName].some(
                attribute => attribute.name === condition.id && attribute.set <= condition.set
              )
            )
          } else if (condition.type === 'bigger') {
            filteredMembers = corporation.value?.members.filter(
              member => member.attributes[attributeGroupName].some(
                attribute => attribute.name === condition.id && attribute.set >= condition.set
              )
            )
          } else if (condition.type === 'equal') {
            filteredMembers = corporation.value?.members.filter(
              member => member.attributes[attributeGroupName].some(
                attribute => attribute.name === condition.id && attribute.set === condition.set
              )
            )
          }

        })
        afterFiltering = corporation.value?.members.map(m => filteredMembers?.includes(m) ? {...m, isVisible: true} : {...m, isVisible: false})
      } else {
        afterFiltering = corporation.value.members.map(m => {return {...m, isVisible: true}})
      }

      corporation.value.members = afterFiltering
      
    }
  }

  const sortMembersByName = () => {
    if (corporation.value && corporation.value.members) {
      // sort by name
      corporation.value.members.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;  // equal names
      })
    }
  }
  
  const sortFiltersByName = () => {
    if (corporation.value && corporation.value.filters) {
      // sort by name
      corporation.value.filters.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;  // equal names
      })
    }
  }

  return {
    corporation,
    loadingCorporation,
    incorrectSecret,
    currentCorporationId,
    setCorporationDetails,
    setWsStatus,
    getWsStatus,
    countMembers,
    fetchCorporationData,
    getCorporationSecret,
    setCorporationSecret,
    updateCorporationMember,
    addCorporationMember,
    deleteCorporationMember,
    deleteCorporationFilter,
    hideMembersWithWsStatus,
    filterMembersByTechLevel,
    addCorporationFilter
  }
}

export default useCorporationDetails;