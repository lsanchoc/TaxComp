class FilterSystem {
    constructor(tree1, tree2) {
        this.dataStruct = {};
        this.keys = new Set();

        //function binding
        this.addKey = this.addKey.bind(this);

        this.buildQuerySystem(tree1, tree2);
    }

    buildQuerySystem(tree1, tree2) {
        //uses proces by level from system
        //build necesary data estructures for filter

        proccesByLevel(tree1, this.addKey);
        proccesByLevel(tree2, this.addKey);

        //console.log(this);
    }

    addKey(node) {
        let name = node.n.toLowerCase();

        //object of the node three that enables search
        //let actualLevel = this.dataStruct;
        let myself = this;
       
        if (!myself.keys.has(name)) {
            myself.keys.add(name);
            myself.dataStruct[name] = new Set();
        }
        myself.dataStruct[name].add(node);
    
    }

    queryTaxons(rank, name) {
        //let keys = name.split(' ');
        //let results = [];
        let myself = this;
        //keys.forEach(rawKey => {
        //    var goalKey = myself.getClosestKey(rawKey);
        //    results.push(myself.dataStruct[goalKey]);
        //});

        var key = myself.getClosestKey(name);
        var results = myself.dataStruct[key];
        let finalResult = results[0];
        print(results)
        //intersection
        /*for (var i = 1; i < results.length; i++) {
            finalResult = new Set(
                [...finalResult].filter(x => results[i].has(x))
            );
        }*/

        /*if (rank) {
            finalResult = new Set(
                [...finalResult].filter(
                    x => x.rank.toLowerCase() == rank.toLowerCase()
                )
            );
        }*/

        //finalResult = Array.from(finalResult);

        //print(this.keys.has("Clitellata"))

        return Array.from(results);
    }


    queryXTaxons(number,rank, name) {
        let results = [];
        let myself = this;

        var goalKeys = myself.getTopNKeys(4,name);
        console.log(goalKeys)
        //print(goalKeys)
        goalKeys.forEach(
            (goalKey) =>{
                results = results.concat(Array.from(myself.dataStruct[goalKey]));
            }
        )
        

        let finalResult = results[0];
        //intersection
        /*for (var i = 1; i < results.length; i++) {
            finalResult = new Set(
                [...finalResult].filter(x => results[i].has(x))
            );
        }*/

        /*if (rank) {
            finalResult = new Set(
                [...finalResult].filter(
                    x => x.rank.toLowerCase() == rank.toLowerCase()
                )
            );
        }*/

        finalResult = Array.from(results);

        //print(this.keys.has("Clitellata"))

        return finalResult;
    }

    querySpecies(name) {
        let keys = name.split(' ');
        let results = [];
        let myself = this;

        keys.forEach(rawKey => {
            var goalKey = myself.getClosestKey(rawKey);
            results.push(myself.dataStruct[goalKey]);
        });

        let finalResult = results[0];
        //intersection
        for (var i = 1; i < results.length; i++) {
            finalResult = new Set(
                [...finalResult].filter(x => results[i].has(x))
            );
        }

        if (rank) {
            finalResult = new Set(
                [...finalResult].filter(x => x.rank.toLowerCase() == 'species')
            );
        }

        finalResult = Array.from(finalResult);

        return finalResult;
    }

    //the search magic ocurs here
    getClosestKey(rawString) {

        let bestKey = undefined;
        let maxVal = 0;
        for (const actualKey of this.keys) {
            var similarityValue = JaroWrinker(actualKey, rawString);

            if (similarityValue > maxVal ) {
                
                maxVal = similarityValue;
                bestKey = actualKey;
                //console.log(similarityValue,actualKey,rawString);
            }
        }

        return bestKey;
    }

    getTopNKeys(number, rawString) {
        let bestKeys = [];
        let maxVal = 0;
        //print(this.keys)
        for (const actualKey of this.keys) {
            var similarityValue = JaroWrinker(actualKey, rawString);

            //check if strings starts with same letters
            if (similarityValue >= maxVal && actualKey.startsWith(rawString.toLowerCase())) {
                //console.log("changed")
                maxVal = similarityValue;
                bestKeys.unshift(actualKey);
                //console.log(similarityValue,actualKey,rawString);
            }
        }

        //not optimal :(
        while (bestKeys.length > number) {
            bestKeys.pop();
        }

        return bestKeys;
    }

}

//similarity function from
//https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely

function similar_text(first, second) {
    // Calculates the similarity between two strings
    // discuss at: http://phpjs.org/functions/similar_text

    if (
        first === null ||
        second === null ||
        typeof first === 'undefined' ||
        typeof second === 'undefined'
    ) {
        return 0;
    }

    first += '';
    second += '';

    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p,
        q,
        l,
        sum;

    max = 0;

    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (
                l = 0;
                p + l < firstLength &&
                q + l < secondLength &&
                first.charAt(p + l) === second.charAt(q + l);
                l++
            );
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }

    sum = max;

    if (sum) {
        if (pos1 && pos2) {
            sum += this.similar_text(
                first.substr(0, pos2),
                second.substr(0, pos2)
            );
        }

        if (pos1 + max < firstLength && pos2 + max < secondLength) {
            sum += this.similar_text(
                first.substr(pos1 + max, firstLength - pos1 - max),
                second.substr(pos2 + max, secondLength - pos2 - max)
            );
        }
    }

    return sum;
}


//https://medium.com/@sumn2u/string-similarity-comparision-in-js-with-examples-4bae35f13968
//procentual similarity function :)
function JaroWrinker (s1, s2) {
    var m = 0;

    // Exit early if either are empty.
    if ( s1.length === 0 || s2.length === 0 ) {
        return 0;
    }

    // Exit early if they're an exact match.
    if ( s1 === s2 ) {
        return 1;
    }

    var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
        s1Matches = new Array(s1.length),
        s2Matches = new Array(s2.length);

    for ( i = 0; i < s1.length; i++ ) {
        var low  = (i >= range) ? i - range : 0,
            high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

        for ( j = low; j <= high; j++ ) {
        if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
            ++m;
            s1Matches[i] = s2Matches[j] = true;
            break;
        }
        }
    }

    // Exit early if no matches were found.
    if ( m === 0 ) {
        return 0;
    }

    // Count the transpositions.
    var k = n_trans = 0;

    for ( i = 0; i < s1.length; i++ ) {
        if ( s1Matches[i] === true ) {
        for ( j = k; j < s2.length; j++ ) {
            if ( s2Matches[j] === true ) {
            k = j + 1;
            break;
            }
        }

        if ( s1[i] !== s2[j] ) {
            ++n_trans;
        }
        }
    }

    var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
        l      = 0,
        p      = 0.1;

    if ( weight > 0.7 ) {
        while ( s1[l] === s2[l] && l < 4 ) {
        ++l;
        }

        weight = weight + l * p * (1 - weight);
    }

    return weight;
}
/*
console.log(
    JaroWrinker("aaacv","aaacv"),
    JaroWrinker("aaaaaaacv","aaaaacv"),
    JaroWrinker("aaacvvv","aaacccv"),
)*/