(function(){

    var _combinator = function(){
        this.indexMap = [];
        this.variants = {};
        this.firstStep = true;
    };

    module.exports = _combinator;

    _combinator.prototype.addVariants = function(key, variation){

        if (!this.firstStep)
            throw new Error("You need to reset combinator object to add variants");

        this.variants[key] = variation;
        this.indexMap.push({
            key: key,
            currIndex: 0
        });
    };

    _combinator.prototype.reset = function(){
        this.firstStep = true;
        for (var i in this.indexMap){
            this.indexMap[i]['currIndex'] = 0;
        }
    }

    _combinator.prototype.next = function(){
        return (this.nextStep_() ? this.getCurrent_() : false);
    };

    _combinator.prototype.getAllVariants = function(){
        if (!this.firstStep)
            this.reset();

        var results = []; var value;
        while((value = this.next()) !== false)
            results.push(value);

        return results;
    };

    _combinator.prototype.nextStep_ = function(lastMapIndex){

        if (this.firstStep){
            this.firstStep = false;
            return true;
        }

        var lmi = (lastMapIndex !== undefined) ? lastMapIndex : this.indexMap.length - 1;

        if (lmi < 0)
            return false;

        if (this.indexMap[lmi]['currIndex'] < this.variants[this.indexMap[lmi]['key']].length - 1){
            this.indexMap[lmi]['currIndex']++;
            return true;
        } else {
            var nextLmi = lmi - 1;
            var nextStepFlag = this.nextStep_(nextLmi);
            if (nextStepFlag)
                this.indexMap[lmi]['currIndex'] = 0;
            return nextStepFlag;
        }

    };

    _combinator.prototype.getCurrent_ = function(){

        var current = {};
        for (var i in this.indexMap)
            current[this.indexMap[i]['key']] = this.variants[this.indexMap[i]['key']][this.indexMap[i]['currIndex']];

        return current;
    };

})();