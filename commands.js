var Creeps = function (level, sum) {
    if (!level || level < 10) {
        return;
    }
    if (level < 71 && sum > 2200) {
        return "Shadow";
    }
    if (level === 10) {
        return "Bush";
    }
    if (level < 16) {
        return "Locust";
    }
    if (level < 21) {
        return "Spider";
    }
    if (level < 31) {
        return "Goblin";
    }
    if (level < 41) {
        return "Lich";
    }
    if (level < 51) {
        return "Skeleton";
    }
    if (level < 61) {
        return "Ghost";
    }
    if (level < 71) {
        return "Shadow";
    }
    if (level < 81) {
        return "Troll";
    }
    if (level < 91) {
        return "Cyclop";
    }
    if (level < 101) {
        return "Mutant";
    }
    if (level < 111) {
        return "Monkey";
    }
    if (level < 121) {
        return "Phoenix";
    }
    if (level < 131) {
        return "Minotaur";
    }
    if (level < 141) {
        return "Beholder";
    }
    if (level > 140) {
        return "Ogre";
    }
};

/*alias -l mRPG:Monsters {
  if (6000 <= $1) { return Hippogriff }
  if (5000 <= $1) { return Sphinx }
  if (4500 <= $1) { return Dragon }
  if (4000 <= $1) { return Vampire }
  if (3500 <= $1) { return Mammoth }
  if (3000 <= $1) { return Centaur }
  return Medusa
}
*/
var Monsters = function (sum) {
    if (6000 <= sum) {
        return 'Hippogriff';
    }
    if (5000 <= sum) {
        return 'Sphinx';
    }
    if (4500 <= sum) {
        return 'Dragon';
    }
    if (4000 <= sum) {
        return 'Vampire';
    }
    if (3500 <= sum) {
        return 'Mammoth';
    }
    if (3000 <= sum) {
        return 'Centaur';
    }
    return 'Medusa';
};

exports.Monsters = Monsters;
exports.Creeps = Creeps;
