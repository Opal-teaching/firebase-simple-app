(function(){

    var module = angular.module("firebase-example-app");

    module.filter("handleLongText" , handleLongText);
    handleLongText.$inject = [];
    /**
     * @ngdoc filter
     * @name firebase-example-app.filter:handleLongText
     * @param {string} input String to format with line breaks.
     * @param {number} lineLength Number of characters per new line in the formatted string.
     * @description Formats text to add line breaks every lineLength number of characters.
     **/
    function handleLongText() {

        return function(input,lineLength) {

            var output = "";
            var numLoops = Math.ceil(input.length / lineLength);

            for (var i=0; i<numLoops; i++){

                if (i===0){
                    output = input.slice(i*lineLength, (i+1)*lineLength);
                }
                else {
                    output = output + "\n" + input.slice(i*lineLength, (i+1)*lineLength);
                }
console.log(output);
            }
            return output;
        }
    }
})();