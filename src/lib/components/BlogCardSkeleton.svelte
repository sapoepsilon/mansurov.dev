<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="block w-full">
    <Card.Root class="flex flex-col sm:flex-row md:flex-row bg-card text-card-foreground w-full">
        <div class="w-full sm:w-1/4 aspect-video sm:aspect-square overflow-hidden">
            <Skeleton class="w-full h-full" />
        </div>
        <div class="flex-1 p-4 flex flex-col justify-between">
            <div>
                <Skeleton class="h-6 w-3/4 mb-2" />
                <Skeleton class="h-4 w-full mb-1" />
                <Skeleton class="h-4 w-5/6" />
            </div>
            <div class="pt-4">
                <Skeleton class="h-10 w-24" />
            </div>
        </div>
    </Card.Root>
</div>
