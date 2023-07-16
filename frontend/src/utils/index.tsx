// Shortens an Ethereum address
export function shortenAddress(address = '', charsStart = 4, charsEnd = 4): string {
  if (address.length === 0) return ''
  return `${address.slice(0, charsStart)}...${address.slice(address.length - charsEnd)}`
}

export const getExplorerLink = (
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block' | 'contract',
): string => {
  const prefix = 'https://bscscan.com'

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'contract': {
      return `${prefix}/contract/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}
