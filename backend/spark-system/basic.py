from pyspark.sql import SparkSession

pokemon_file_uri = "hdfs://localhost:9000/datasets/Pokemon.csv"

spark = SparkSession.builder.appName("BasicApp").getOrCreate()
pokemon = spark.read.csv(pokemon_file_uri)

print(pokemon.head())

for col in pokemon.columns: 
    selector += ("%s as %s, " % (col, str(pokemon.head()[col])))

newColumns = [str(pokemon.head()[col]) for col in pokemon.columns]

poke = reduce(lambda pokemon, idx: pokemon.withColumnRenamed(oldColumns[idx], newColumns[idx]), xrange(len(oldColumns)), pokemon)


spark.stop()