new Vue({
    el: '#app',
    data:{
        player:{
            class:false,
            specialAttack:''
        },
        playerLife: 100,
        monsterLife: 100,
        running:false,
        classPanel:false,
        classes:[
            {name:'GUERREIRO',attack:'Fúria da Leão'},
            {name:'MAGO',attack:'Ira de Thor'},
            {name:'RANGER',attack:'Torrente de Flechas'},
            {name:'LADINO',attack:'Sussuro das Sombras'}
        ],
        logs:[],
        potions:3,
        specials:3
    },
    computed:{
        hasResult(){
            return this.playerLife == 0 || this.monsterLife == 0;
        }
    },
    methods:{
        newGame(){
            this.playerLife = 100;
            this.monsterLife = 100;
            this.logs = [];
            this.specials = 3;
            this.potions = 3;
            this.classPanel = true;
            this.running = !this.running;
        },
        chooseClass(choosedClass){
            this.player.class = choosedClass;
            let classes = this.classes;
            let specialAttack;

            classes.forEach(function (classe){
                if(classe.name == choosedClass){
                    specialAttack = classe.attack;
                }
            });

            this.player.specialAttack = specialAttack;

            this.classPanel = false;
        },
        healAndHurt(){
            this.heal(12,25);
            this.hurt('playerLife',8,16,false,'Monstro','Jogador','monster');
        },
        heal(min,max){
            const heal = this.getRandom(min,max);
            //Retorna o maior dos números, onde o número não poderá ser maior que 100
            this.playerLife = Math.min(this.playerLife + heal,100);
            this.registerLog(`Jogador usou Potion e curou ${heal} de força.`,'player');
            this.potions--;
        },
        attack(special){
            this.hurt('monsterLife',5,12,special,'Jogador','Monstro','player');
            if(this.monsterLife > 0){
                this.hurt('playerLife',8,16,false,'Monstro','Jogador','monster');
            }
        },
        hurt(atr,min,max,special,source,target,cls){
            const plus = special ? this.getRandom(min,max) : 0;
            const hurt = this.getRandom(min + plus, max + plus);
            //Retorna o maior dos números, onde caso o número venha a ser negativo o retorno será 0
            this[atr] = Math.max(this[atr] - hurt, 0);
            if(!special){
                this.registerLog(`${source} feriu ${target} com ${hurt} de dano.`,cls)
            }else{
                this.specials--;
                this.registerLog(`${source} usou ${this.player.specialAttack} e causou ${hurt} de dano no ${target}.`,cls)
            }
        },
        registerLog(text,cls){
            this.logs.unshift({text,cls})
        },
        getRandom(min,max){
            const value = Math.random()*(max - min) + min;
            return Math.round(value);
        },
        giveUp(){
            this.playerLife = 0;
            this.running = false;
        }
    },
    watch:{
        hasResult(value){
            if(value) this.running = false;
        }
    }
})