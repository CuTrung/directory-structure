module.exports = {
    removeDiacritics: (str = "") => str.normalize("NFD")?.replace(/\p{Diacritic}/gu, ""),
    hashString: (str) => hashSync(str, genSaltSync(10)),
    compareHashString: (str, hashStr) => compareSync(str, hashStr),
    decodeBase64: (strBase64) => Buffer.from(strBase64, 'base64').toString('utf-8'),
    encodeBase64: (value) => Buffer.from(JSON.stringify(value), 'utf-8').toString('base64'),
    capitalizeFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1)
}