const responses = [];
// _ after function name because ts threw naming collision errors on import
function getFilterRes_() {
    const randomElement = responses[Math.floor(Math.random() * responses.length)];
    return randomElement;
}
module.exports = getFilterRes_;
//# sourceMappingURL=getFilterResponse.js.map