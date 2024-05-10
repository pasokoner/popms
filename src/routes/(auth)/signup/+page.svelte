<script>
	import { UserRoundPlusIcon } from "lucide-svelte";
</script>
<main
	class= " container bg-white min-w-fit p-9 flex justify-center">
	<div class="container w-[510px] rounded-lg bg-gray-100 text-center">
		<div class="container rounded-tl-24 border-r-1 gap-24 border-black pt-4">
			<div class="container flex justify-center">
				<div class="rounded-full border p-4 bg-gradient-to-b from-gray-200 to-white">
					<div class="rounded-full border bg-white p-2">
						<UserRoundPlusIcon class="size-8 stroke-current stroke-1"/>
					</div>
				</div>
			</div>
				<div class="container">
					<h1 class="text-[24px] font-semibold">Explore Our Dashboard</h1>
					<p class="text-[14px] text-gray-500">
						After filling out the form, a sustainability expert from our will contact you.
					</p>
				</div>
				<div class="container space-y-2 text-[14px] gap-1">
					<hr class="border-t-2 my-1 w-full border-gray-500" />
					<p class="text-left font-semibold">Full Name</p>
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 h-[40px] font-thin p-3"
							placeholder="James Brown"
						/>
					<div class="sm:flex sm:flex-row gap-3 w-full">
					<div class="w-full">
						<p class="text-left mr-10 font-semibold">Business Email</p>
						<input
							type="email"
							class="h-10 w-full rounded-lg border-2 border-gray-200 h-[40px] font-thin p-3"
							placeholder="Hello@pixel.com"
						/>
					</div>
					<div class="w-full">
						<p class="text-left mr-10 font-semibold">Telephone Number</p>
						<input
							type="number"
							class="h-10 w-full rounded-lg border-2 border-gray-200 h-[40px] font-thin p-3"
							placeholder="120120120120"
						/>
					</div>
				</div>
				<div class=" sm:flex sm:flex-row gap-3 w-full">
					<div class="w-full">
						<p class="text-left font-semibold">Company</p>
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 h-[40px] font-thin p-3"
							placeholder="Company"
						/>
					</div>
					<div class="w-full">
						<p class="text-left font-semibold">Job Title</p>
						<input
							type="text"
							class="h-10 w-full rounded-lg border-2 border-gray-200 h-[40px] font-thin p-3"
							placeholder="Job Titles"
						/>
					</div>
				</div>
			</div>
			<div class="container p-3">
				<button class=" h-10 w-full rounded-lg border text-[14px] bg-green-800 text-white hover:bg-green-800"
					>Book a Demo</button
				>
			</div>
		</div>
	</div>
</main>
