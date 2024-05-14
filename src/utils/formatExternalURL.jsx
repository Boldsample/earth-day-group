export const formatExternalURL = url => {
	return (url.search('http') != -1 ? '' : 'http://') + url
}