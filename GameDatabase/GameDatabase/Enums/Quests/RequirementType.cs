﻿namespace GameDatabase.Enums.Quests
{
    public enum RequirementType
    {
        Empty = 0,
        Any = 1,
        All = 2,
        None = 3,
        PlayerPosition = 6,
        RandomStarSystem = 7,
        AggressiveOccupants = 8,

        QuestCompleted = 9,
        QuestActive = 10,

        CharacterRelations = 15,
        FactionRelations = 16,

        Faction = 20,

        HaveQuestItem = 25,
        HaveItem = 26,
        HaveItemById = 27,

        ComeBack = 30,
    }
}
