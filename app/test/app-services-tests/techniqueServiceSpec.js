describe("Technique.Service.Test", function(){
    var techniqueService;

    beforeEach(module("app"));

    beforeEach(inject(function(TechniqueService){
        techniqueService = TechniqueService;
    }));

    it('can get an instance of technique service', function(){
        expect(techniqueService).toBeDefined();
    });

    it('SortTechniques should return an array of sorted techniques', function() {
        var unsortedTechniques = ["Pang Tooki", "Pal Makki", "Kal Makki", "Warmup", "Stepping Form", "Break falls", "Son Bag Ki", "Pal Chagi", "Yon Kuel Pal Chagi", "Kwon Sool", "Kwon Bop", "Makko Chagi", "Fwall Young Sool", "Jumook Makki", "Kibon Su", "Son Mok Su", "Sun Chi Su", "Joon Bong Su", "Ee Bok Su", "Twe Su", "Yang Chi Su"];
        var sortTechniques = techniqueService.SortTechniques(unsortedTechniques);
        var sortedTechniques = ["Warmup", "Stepping Form", "Break falls", "Son Bag Ki", "Pal Chagi", "Yon Kuel Pal Chagi", "Kwon Sool", "Kwon Bop", "Makko Chagi", "Fwall Young Sool", "Jumook Makki", "Kibon Su", "Son Mok Su", "Sun Chi Su", "Joon Bong Su", "Ee Bok Su", "Twe Su", "Yang Chi Su", "Pang Tooki", "Pal Makki", "Kal Makki"];
        expect(sortTechniques).toEqual(sortedTechniques);
    });
});