const initialState = {
    IPAddress: {
        IPs: [],
        isIpRestriction: 0,
        error: null,
    },
}

export default function IPSecurity(state = initialState, action = {}) {    
    switch (action.type) {
        case 'GET_IP_SUCCESS':           
            return {
                ...state,
                IPAddress: {
                    ...state.IPAddress,
                    IPs: action.payload.ipAddresses,
                    isIpRestriction: action.payload.isIpRestriction,                    
                    error: null,                    
                }
            }
        case 'GET_IP_FAILED':
            return {
                ...state,
                IPAddress: {
                    ...state.IPAddress,
                    error: action.payload
                }
            }
        case 'UPDATE_IP_SUCCESS':            
            return {                
                ...state,
                IPAddress: {
                    ...state.IPAddress,
                    IPs: action.payload.ipAddresses,
                    isIpRestriction: action.payload.isIpRestriction,  
                    error: null,                  
                }
            }
        case 'UPDATE_IP_FAILED':                      
            return {
                ...state,
                IPAddress: {
                    ...state.IPAddress,
                    error: action.payload
                }
            }        
        default:
            return state;        
    }
}