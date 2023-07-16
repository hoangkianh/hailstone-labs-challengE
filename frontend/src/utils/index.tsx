// Shortens an Ethereum address
export function shortenAddress(address = '', charsStart = 4, charsEnd = 4): string {
  if (address.length === 0) return ''
  return `${address.slice(0, charsStart)}...${address.slice(address.length - charsEnd)}`
}
