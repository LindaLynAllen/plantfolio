import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plant } from '@/types/plant';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link href={`/plant/${plant.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] py-0 gap-0">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={plant.thumbnailUrl}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="font-semibold text-lg">{plant.name}</h3>
          {plant.scientificName && (
            <p className="text-sm text-muted-foreground italic mt-1">
              {plant.scientificName}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
