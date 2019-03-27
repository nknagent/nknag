import axios from "axios";
export default {
    data() {
        return {
            interval: null,
            loader: true,
            blocktime: 20,
            nodeCost: 0,
            workingTime: 1,
            userNodes: 1,
            bandWidthCost: 0,
            testTokensDaily: 0,
            totalTestTokens: 0,
            totalMainTokens: 0,
            usdProfitPerDay: 0,
            usdProfit: 0,
            nknPrice: 0,
            totalNodes: 0,
            crawlCounter: 'Loading...'
        };
    },
    destroyed() {
        clearInterval(this.interval);
    },
    created: function() {
        this.getCalcData()
    },
    mounted: function() {
        
    },
    updated(){
         this.miningCalc()
    },
    methods: {
        miningCalc(){
            const self = this
            const secDay = 86400
            let dailyMined = (secDay / self.blocktime) * 15
            let totalNodeCost = self.nodeCost * self.workingTime * self.userNodes
            let totalBandwidthCost = self.bandWidthCost * self.workingTime * self.userNodes
            let dailyNodeCost = self.nodeCost / 30 * self.userNodes
            let dailyBandwidthCost = self.bandWidthCost / 30 * self.userNodes
            self.testTokensDaily = (dailyMined * self.userNodes / self.totalNodes).toFixed(0)
            self.totalTestTokens = (self.testTokensDaily * 30 * self.workingTime).toFixed(0)
            self.totalMainTokens = (self.totalTestTokens / 5).toFixed(0)
            self.usdProfitPerDay = (self.testTokensDaily / 5 * self.nknPrice - dailyBandwidthCost - dailyNodeCost).toFixed(2)
            self.usdProfit = (self.nknPrice * self.totalMainTokens - totalBandwidthCost - totalNodeCost).toFixed(2)
        },
        getCalcData(){
            const self = this
            axios.get('https://price.nknx.org/price?quote=NKN&currency=USD')
            .then(response => {
                console.log(response)
                self.nknPrice = response.data[0].prices[0].price.toFixed(3)
            })
            .catch(function(error){
                self.nknPrice = 'error';
            })
            axios.get('crawledNodes', {})
            .then((response) => {
                self.crawlCounter = response.data.length
                self.totalNodes = self.crawlCounter
                self.loader = false
            })
            axios.get('nodes', {
            })
            .then((response) => {
                self.userNodes = response.data.length
            })
 
        }
    }
};