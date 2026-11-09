// DSA data for Prep Desk: Problems -> Patterns -> Tools -> Fundamental Blocks.
// Each item is [title, description, details]. Pattern details hold tier, recognize, idea,
// template, pitfalls, staff, problems ([leetcodeNumber|null, title, difficulty, flags]),
// tools and blocks (titles of cards in the Tools and Fundamental Blocks layers).
// "G" marks problems candidates report from Google loops; "B75" marks the Blind 75.
(function () {
  "use strict";

  var PATTERNS = [];

PATTERNS.push({
  name: "Arrays & Strings",
  blurb: "Linear scans that turn O(n²) pair checks into one or two passes with the right bookkeeping.",
  items: [
    ["Hash Lookup & Complement", "Store what you've seen so each new element asks 'does my partner already exist?' in O(1) instead of rescanning.", {
      tier: "core",
      recognize: "Pairs or groups with a relation (sum to target, same key, seen before) and no sortedness to exploit; brute force is a nested loop over pairs.",
      idea: "Walk once; for each x, look up the value it needs (target - x, a canonical key) in a map of everything before it, then insert x. Checking before inserting avoids pairing an element with itself. O(n) time, O(n) space.",
      template: `def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []`,
      pitfalls: "Inserting before checking, so x pairs with itself; using a list as a key (unhashable) instead of a tuple; forgetting duplicates overwrite earlier indices",
      staff: "If the data doesn't fit in memory, hash-partition both sides by key so matching pairs land in the same shard, then run the in-memory version per shard. If memory is tight but sorting is allowed, sort plus two pointers gives O(1) extra space.",
      problems: [[1, "Two Sum", "E"], [217, "Contains Duplicate", "E"], [219, "Contains Duplicate II", "E"], [49, "Group Anagrams", "M"], [128, "Longest Consecutive Sequence", "M"], [205, "Isomorphic Strings", "E"]],
      tools: ["Hash Map", "Hash Set", "collections: deque, Counter, defaultdict"],
      blocks: ["Single Pass", "Hashable Keys", "Space-Time Trade-off"]
    }],
    ["Frequency Counting & Bucket Sort", "Count occurrences into a map or fixed array, then read answers from counts or buckets indexed by frequency.", {
      tier: "core",
      recognize: "Anagrams, 'most/least frequent', 'top k by count', or the alphabet is small (26 letters, digits).",
      idea: "Build a frequency table in one pass. For top-k, bucket elements by count (count is at most n), then walk buckets from high to low. Counting is O(n); buckets avoid the O(n log n) sort.",
      template: `from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for x, c in count.items():
        buckets[c].append(x)
    out = []
    for c in range(len(buckets) - 1, 0, -1):
        for x in buckets[c]:
            out.append(x)
            if len(out) == k:
                return out
    return out`,
      pitfalls: "Comparing two Counters element by element instead of with ==; using a 26-slot array when input can include uppercase or Unicode; sorting the whole map when only the top k is needed",
      staff: "For a stream too large to count exactly, use Count-Min Sketch plus a size-k heap, or Misra-Gries heavy hitters, and state the error bound. Across machines, count locally, then merge partial counts by key.",
      problems: [[242, "Valid Anagram", "E"], [383, "Ransom Note", "E"], [347, "Top K Frequent Elements", "M"], [451, "Sort Characters By Frequency", "M"], [692, "Top K Frequent Words", "M"], [1347, "Minimum Number of Steps to Make Two Strings Anagram", "M"]],
      tools: ["Counter / Frequency Map", "Counting / Bucket / Radix Sort", "collections: deque, Counter, defaultdict"],
      blocks: ["Accumulators", "Precomputation", "Space-Time Trade-off"]
    }],
    ["Two Pointers: Converging", "Start at both ends of a sorted or symmetric sequence and move the pointer that can't be part of a better answer.", {
      tier: "core",
      recognize: "Sorted array with a pair/triplet target, palindrome checks, or 'max area between two lines'.",
      idea: "Each step discards the pointer that provably cannot improve the answer: if sum < target, nothing pairs with nums[lo] usefully, so lo += 1. Invariant: no valid pair lies outside [lo, hi]. O(n) per scan; 3Sum fixes one element and scans, O(n²).",
      template: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]:
            continue
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if s < 0: lo += 1
            elif s > 0: hi -= 1
            else:
                res.append([nums[i], nums[lo], nums[hi]])
                lo += 1
                while lo < hi and nums[lo] == nums[lo - 1]:
                    lo += 1
    return res`,
      pitfalls: "Skipping duplicates in the wrong place, so triplets are lost or repeated; using lo <= hi and pairing an element with itself; forgetting the input must be sorted first",
      staff: "Be ready to compare it with the hash-set version: same O(n²) for 3Sum, but two pointers needs O(1) extra space and handles dedup naturally. For k-Sum, generalise by recursing down to the 2-pointer base case, O(n^(k-1)).",
      problems: [[125, "Valid Palindrome", "E"], [167, "Two Sum II - Input Array Is Sorted", "M"], [15, "3Sum", "M"], [16, "3Sum Closest", "M"], [11, "Container With Most Water", "M"], [42, "Trapping Rain Water", "H"], [18, "4Sum", "M"]],
      tools: ["Array & Dynamic Array", "Comparison Sort & Comparators"],
      blocks: ["Two-Index While Loop", "Loop Invariants", "Monotonicity"]
    }],
    ["Two Pointers: Read/Write & Partition", "A slow write pointer keeps the good prefix while a fast read pointer scans, compacting or partitioning in place.", {
      tier: "core",
      recognize: "'In place', 'O(1) extra space', remove/move elements, or group values into 2-3 classes (Dutch national flag).",
      idea: "Invariant: nums[:write] is the finished output, nums[write:read] is junk. Three-way partition keeps low < mid-unknown < high regions. O(n) time, O(1) space.",
      template: `def sort_colors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1          # don't advance mid: swapped-in value is unchecked`,
      pitfalls: "Advancing mid after swapping with hi; returning the array instead of the new length when the API expects the length; comparing against the original array instead of the written prefix",
      staff: "This partition step is the core of quicksort and quickselect, so connect it there. For stable compaction across a huge file, the same read/write idea becomes a streaming filter with one buffered writer.",
      problems: [[26, "Remove Duplicates from Sorted Array", "E"], [27, "Remove Element", "E"], [283, "Move Zeroes", "E"], [80, "Remove Duplicates from Sorted Array II", "M"], [75, "Sort Colors", "M"], [905, "Sort Array By Parity", "E"]],
      tools: ["Array & Dynamic Array", "Partition Procedure"],
      blocks: ["Swap", "Loop Invariants", "Two-Index While Loop"]
    }],
    ["Fixed-Size Sliding Window", "Keep a window of exactly k elements and update its summary as one element enters and one leaves.", {
      tier: "core",
      recognize: "'Subarray/substring of length k', 'every window of size k', anagram/permutation of a fixed pattern inside a string.",
      idea: "Add the new right element, remove the element that falls off the left (index i - k), then record the window. Each element enters and leaves once: O(n) time, O(k) or O(alphabet) space.",
      template: `def find_anagrams(s, p):
    need = [0] * 26
    have = [0] * 26
    for c in p:
        need[ord(c) - 97] += 1
    res, k = [], len(p)
    for i, c in enumerate(s):
        have[ord(c) - 97] += 1
        if i >= k:
            have[ord(s[i - k]) - 97] -= 1
        if have == need:
            res.append(i - k + 1)
    return res`,
      pitfalls: "Recording the window before it has k elements; off-by-one in the outgoing index (i - k vs i - k + 1); recomputing the whole window each step, which makes it O(nk)",
      staff: "Over a live stream this becomes a ring buffer of the last k items with O(1) updates. For a windowed max or min, switch to a monotonic deque. For a time-based window, evict by timestamp instead of count.",
      problems: [[643, "Maximum Average Subarray I", "E"], [438, "Find All Anagrams in a String", "M"], [567, "Permutation in String", "M"], [1456, "Maximum Number of Vowels in a Substring of Given Length", "M"], [1052, "Grumpy Bookstore Owner", "M"], [187, "Repeated DNA Sequences", "M"]],
      tools: ["Counter / Frequency Map", "Circular Buffer", "Array & Dynamic Array"],
      blocks: ["Single Pass", "Accumulators", "Off-by-One Errors"]
    }],
    ["Variable-Size Sliding Window", "Grow the right edge and shrink the left edge only while the window breaks the constraint: longest/shortest valid subarray in O(n).", {
      tier: "core",
      recognize: "'Longest/shortest substring or subarray such that...' where the constraint is monotonic: shrinking a valid window keeps it valid (or growing an invalid one keeps it invalid). All values non-negative for sum constraints.",
      idea: "For each right, add s[right]; while the window is invalid, remove s[left] and left += 1; then the window [left, right] is the best one ending at right. Both pointers only move forward, so O(n) total. For 'shortest', shrink while valid and record inside the loop.",
      template: `def longest_without_repeat(s):
    last = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        best = max(best, right - left + 1)
    return best

def min_window_len(nums, target):   # shortest sum >= target, nums >= 0
    left, total, best = 0, 0, float("inf")
    for right, x in enumerate(nums):
        total += x
        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if best == float("inf") else best`,
      pitfalls: "Using it with negative numbers, where shrinking doesn't restore validity (use prefix sums + hashmap or a deque instead); moving left backwards when jumping via a last-seen map; tracking 'formed' counts wrongly in Minimum Window Substring",
      staff: "Explain why it is O(n) amortised, since each index enters and leaves once. If asked for a streaming version, note that the window state must stay bounded. For negatives, switch patterns and say why.",
      problems: [[3, "Longest Substring Without Repeating Characters", "M"], [424, "Longest Repeating Character Replacement", "M"], [76, "Minimum Window Substring", "H"], [209, "Minimum Size Subarray Sum", "M"], [904, "Fruit Into Baskets", "M"], [1004, "Max Consecutive Ones III", "M"], [340, "Longest Substring with At Most K Distinct Characters", "M"]],
      tools: ["Hash Map", "Counter / Frequency Map"],
      blocks: ["Two-Index While Loop", "Running Best-So-Far", "Monotonicity", "Amortized Analysis"]
    }],
    ["Exactly K = atMost(K) − atMost(K−1)", "Count subarrays with exactly K of something by subtracting two easy 'at most' sliding-window counts.", {
      tier: "google",
      recognize: "'Number of subarrays with exactly K distinct / K odd / sum K' where a direct window can't decide when to shrink.",
      idea: "atMost(K) is a standard variable window: for each right, every subarray ending at right and starting in [left, right] is valid, so add right - left + 1. Exactly(K) = atMost(K) - atMost(K-1). Two O(n) passes.",
      template: `def subarrays_with_k_distinct(nums, k):
    def at_most(k):
        count, left, total = {}, 0, 0
        for right, x in enumerate(nums):
            count[x] = count.get(x, 0) + 1
            while len(count) > k:
                count[nums[left]] -= 1
                if count[nums[left]] == 0:
                    del count[nums[left]]
                left += 1
            total += right - left + 1
        return total
    return at_most(k) - at_most(k - 1)`,
      pitfalls: "Not deleting zero-count keys, so len(count) is wrong; calling at_most(-1) without a guard when k = 0; adding 1 per valid window instead of right - left + 1",
      staff: "Mention the alternative: prefix-count + hashmap works for exact sums (Binary Subarrays With Sum) in one pass. Pick the transform that matches whether the property is additive.",
      problems: [[992, "Subarrays with K Different Integers", "H"], [1248, "Count Number of Nice Subarrays", "M"], [930, "Binary Subarrays With Sum", "M"], [795, "Number of Subarrays with Bounded Maximum", "M"], [2062, "Count Vowel Substrings of a String", "E"]],
      tools: ["Counter / Frequency Map", "Hash Map"],
      blocks: ["Reduction / Transform", "Helper Functions & Closures", "Two-Index While Loop"]
    }],
    ["Prefix Sum + Hash Map", "sum(i..j) = prefix[j+1] − prefix[i], so 'subarray with sum K' becomes 'have I seen prefix − K before?'.", {
      tier: "core",
      recognize: "Count or find subarrays with a given sum, a sum divisible by k, or equal 0s and 1s, especially when values can be negative (where sliding windows fail).",
      idea: "Keep a running prefix and a map from prefix value to its count (or first index). For each new prefix p, the number of subarrays ending here with sum k is seen[p - k]. Seed with {0: 1}. O(n) time and space.",
      template: `def subarray_sum(nums, k):
    seen = {0: 1}            # prefix value -> count
    prefix = count = 0
    for x in nums:
        prefix += x
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count`,
      pitfalls: "Forgetting the {0: 1} seed, which misses subarrays starting at index 0; for divisibility, negative remainders in languages where % can be negative; storing the latest index when 'longest' needs the first",
      staff: "Generalise to 2D (fix two rows, run 1D on column sums, O(n²m)) and to trees (path sums with a prefix map in DFS). For a stream, the map grows with distinct prefixes, so discuss bounding it with a window.",
      problems: [[560, "Subarray Sum Equals K", "M"], [974, "Subarray Sums Divisible by K", "M"], [525, "Contiguous Array", "M"], [523, "Continuous Subarray Sum", "M"], [303, "Range Sum Query - Immutable", "E"], [1074, "Number of Submatrices That Sum to Target", "H"]],
      tools: ["Hash Map", "Array & Dynamic Array"],
      blocks: ["Precomputation", "Accumulators", "Negative Modulo", "Reduction / Transform"]
    }],
    ["Prefix / Suffix Decomposition", "Precompute what's to the left and right of every index, then combine them for an O(n) answer without division or rescans.", {
      tier: "core",
      recognize: "'Product/sum of everything except i', 'max to the left and right', water trapped, or the answer at i depends on both sides.",
      idea: "One left-to-right pass stores the aggregate of nums[:i]; one right-to-left pass multiplies in the aggregate of nums[i+1:]. Works for any associative operation. O(n) time, O(1) extra if the output array holds one side.",
      template: `def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):
        out[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out`,
      pitfalls: "Using division and breaking on zeros; including nums[i] in its own prefix; off-by-one between the inclusive and exclusive prefix",
      staff: "Trapping Rain Water has three answers: prefix/suffix max arrays (O(n) space), two pointers (O(1) space), and a monotonic stack. Present all three and their trade-offs. For a 2D version (Trapping Rain Water II), switch to a heap-based BFS.",
      problems: [[238, "Product of Array Except Self", "M"], [42, "Trapping Rain Water", "H"], [724, "Find Pivot Index", "E"], [1769, "Minimum Number of Operations to Move All Balls to Each Box", "M"], [2483, "Minimum Penalty for a Shop", "M"], [845, "Longest Mountain in Array", "M"]],
      tools: ["Array & Dynamic Array"],
      blocks: ["Two Pass", "Reverse Scan", "Precomputation", "Half-Open vs Closed Ranges"]
    }],
    ["Difference Array & Range Updates", "Record +v at the start and −v just past the end of each range; one prefix sum then applies every update.", {
      tier: "google",
      recognize: "Many 'add v to range [l, r]' updates followed by reads, bookings, passengers on/off, or counts of overlapping intervals over a bounded coordinate range.",
      idea: "diff[l] += v and diff[r+1] -= v cost O(1) per update; the prefix sum of diff is the final array. O(n + q) instead of O(n·q). It is the inverse of prefix sums.",
      template: `def car_pooling(trips, capacity):
    diff = [0] * 1001
    for passengers, start, end in trips:
        diff[start] += passengers
        diff[end] -= passengers        # drop-off frees seats at 'end'
    load = 0
    for change in diff:
        load += change
        if load > capacity:
            return False
    return True`,
      pitfalls: "Using r instead of r + 1 for inclusive ranges, or the reverse for half-open ones; sizing the array without room for r + 1; huge sparse coordinates, which need a sorted map or coordinate compression instead",
      staff: "When coordinates are huge, the same idea becomes a sweep line over sorted events (a TreeMap). When updates and queries interleave online, move to a Fenwick or segment tree with range updates.",
      problems: [[1094, "Car Pooling", "M"], [1109, "Corporate Flight Bookings", "M"], [370, "Range Addition", "M"], [2381, "Shifting Letters II", "M"], [1854, "Maximum Population Year", "E"], [2406, "Divide Intervals Into Minimum Number of Groups", "M"]],
      tools: ["Array & Dynamic Array", "Ordered Map / Sorted List"],
      blocks: ["Precomputation", "Half-Open vs Closed Ranges", "Off-by-One Errors"]
    }],
    ["2D Prefix Sums", "Precompute rectangle sums so any submatrix sum is four lookups, using inclusion and exclusion.", {
      tier: "google",
      recognize: "Repeated rectangle-sum queries on a static grid, k-radius block sums, or 'largest square with sum ≤ t'.",
      idea: "P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]. A rectangle sum is P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]. O(mn) build, O(1) per query.",
      template: `class NumMatrix:
    def __init__(self, grid):
        m, n = len(grid), len(grid[0])
        self.P = [[0] * (n + 1) for _ in range(m + 1)]
        for r in range(m):
            for c in range(n):
                self.P[r + 1][c + 1] = (grid[r][c] + self.P[r][c + 1]
                                        + self.P[r + 1][c] - self.P[r][c])

    def sum_region(self, r1, c1, r2, c2):
        P = self.P
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]`,
      pitfalls: "Forgetting the padded row and column, so indices go to -1; sign errors in inclusion-exclusion; building the grid with [[0]*n]*m (aliased rows)",
      staff: "If the grid gets point updates, switch to a 2D Fenwick tree (O(log m · log n)). For counting submatrices with a target sum, fix a row pair and reduce to 1D prefix + hashmap.",
      problems: [[304, "Range Sum Query 2D - Immutable", "M"], [1314, "Matrix Block Sum", "M"], [1292, "Maximum Side Length of a Square with Sum Less than or Equal to Threshold", "M"], [2132, "Stamping the Grid", "H"], [1074, "Number of Submatrices That Sum to Target", "H"]],
      tools: ["Matrix / Grid", "Array & Dynamic Array"],
      blocks: ["Precomputation", "Nested Loops", "Aliasing", "Off-by-One Errors"]
    }],
    ["Kadane & Running Best", "Carry the best answer ending at the current index, either extending the previous run or starting fresh, plus a global best.", {
      tier: "core",
      recognize: "Max/min subarray sum or product, best single buy/sell, or 'best so far' where the decision only depends on the previous state.",
      idea: "cur = max(x, cur + x): a negative running sum can never help a later subarray. For products, track both max and min, since a negative flips them. It is a 1-state DP compressed to O(1) space, O(n) time.",
      template: `def max_subarray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

def max_product(nums):
    hi = lo = best = nums[0]
    for x in nums[1:]:
        hi, lo = max(x, hi * x, lo * x), min(x, hi * x, lo * x)
        best = max(best, hi)
    return best`,
      pitfalls: "Initialising best to 0, which fails on all-negative input; updating hi before computing lo from the old hi; circular arrays need total - minSubarray, except when all values are negative",
      staff: "Show the divide-and-conquer O(n log n) alternative and why Kadane wins. Kadane parallelises: each chunk returns (total, best prefix, best suffix, best) and these merge associatively, which is the segment-tree / map-reduce answer.",
      problems: [[53, "Maximum Subarray", "M"], [152, "Maximum Product Subarray", "M"], [121, "Best Time to Buy and Sell Stock", "E"], [918, "Maximum Sum Circular Subarray", "M"], [1749, "Maximum Absolute Sum of Any Subarray", "M"], [1014, "Best Sightseeing Pair", "M"]],
      tools: ["Array & Dynamic Array"],
      blocks: ["Running Best-So-Far", "Single Pass", "Dynamic Programming", "Greedy Choice"]
    }],
    ["Cyclic Sort & Index-as-Hash", "When values lie in 1..n, put each value at index value−1, or flip signs to mark presence, for O(n) time and O(1) space.", {
      tier: "core",
      recognize: "'Array of n integers in range [1, n]' or [0, n], find missing/duplicate numbers, O(1) extra space required.",
      idea: "Swap nums[i] into its home slot until the current slot holds the right value or a duplicate. Each swap places one value permanently, so it is O(n). Then a scan finds the slots whose value is wrong.",
      template: `def first_missing_positive(nums):
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
      pitfalls: "Writing nums[i], nums[nums[i]-1] = ... in Python, where the target index is re-evaluated mid-assignment; infinite loop on duplicates without the != guard; mutating input when the caller forbids it",
      staff: "Compare with the other O(1)-space answers: XOR or Gauss sum for one missing number, Floyd's cycle for one duplicate (read-only input). State which works when the input is read-only or streamed.",
      problems: [[268, "Missing Number", "E"], [448, "Find All Numbers Disappeared in an Array", "E"], [442, "Find All Duplicates in an Array", "M"], [645, "Set Mismatch", "E"], [41, "First Missing Positive", "H"]],
      tools: ["Array & Dynamic Array"],
      blocks: ["Swap", "Zero-Based Indexing", "While Loops", "Amortized Analysis"]
    }],
    ["In-Place Matrix Manipulation", "Rotate, spiral and mark a grid in place using transpose-and-reverse, shrinking boundaries, or extra state bits.", {
      tier: "core",
      recognize: "Rotate/transpose an image, spiral order, zero out rows/columns, or simultaneous cell updates (Game of Life) with O(1) extra space.",
      idea: "90° clockwise = transpose then reverse each row. Spiral keeps top/bottom/left/right bounds and shrinks one after each side. For simultaneous updates, encode old and new state in the same cell (bit 0 = old, bit 1 = new) or use the first row/column as markers.",
      template: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()

def spiral(m):
    res = []
    top, bot, left, right = 0, len(m) - 1, 0, len(m[0]) - 1
    while top <= bot and left <= right:
        res += [m[top][c] for c in range(left, right + 1)]
        res += [m[r][right] for r in range(top + 1, bot + 1)]
        if top < bot:
            res += [m[bot][c] for c in range(right - 1, left - 1, -1)]
        if left < right:
            res += [m[r][left] for r in range(bot - 1, top, -1)]
        top, bot, left, right = top + 1, bot - 1, left + 1, right - 1
    return res`,
      pitfalls: "Double-visiting the last row or column of a single-row/column spiral; transposing over the full matrix (j from 0), which swaps everything back; zeroing row 0 before you've read its markers in Set Matrix Zeroes",
      staff: "For Game of Life on an unbounded board, store only live cells in a set and count neighbours from them. For a board too large for memory, process it in row bands keeping only three rows in memory.",
      problems: [[48, "Rotate Image", "M"], [54, "Spiral Matrix", "M"], [59, "Spiral Matrix II", "M"], [73, "Set Matrix Zeroes", "M"], [289, "Game of Life", "M"], [867, "Transpose Matrix", "E"]],
      tools: ["Matrix / Grid"],
      blocks: ["Nested Loops", "Swap", "Bounds Checks", "Boolean Flags"]
    }],
    ["Simulation & Careful Implementation", "No trick: model the process exactly, with clean state and helpers, so long, fiddly rules come out bug-free.", {
      tier: "google",
      recognize: "Long problem statements with step rules (robots, text layout, zigzag writing, games). Google uses these to test code quality more than algorithms.",
      idea: "Name the state, write one helper per rule, and loop until done. Complexity is usually the length of the simulation, so look for cycles or jumps if steps are huge. Clean decomposition is the signal being graded.",
      template: `def full_justify(words, width):
    lines, i = [], 0
    while i < len(words):
        j, length = i, 0
        while j < len(words) and length + len(words[j]) + (j - i) <= width:
            length += len(words[j])
            j += 1
        gaps = j - i - 1
        if j == len(words) or gaps == 0:
            line = " ".join(words[i:j]).ljust(width)
        else:
            space, extra = divmod(width - length, gaps)
            line = ""
            for k in range(i, j - 1):
                line += words[k] + " " * (space + (1 if k - i < extra else 0))
            line += words[j - 1]
        lines.append(line)
        i = j
    return lines`,
      pitfalls: "Mixing parsing, state updates and output in one big loop; special cases for the last line or a single word; simulating 10^9 steps when the state repeats with a short period",
      staff: "Narrate the design first: what state, which helpers, which invariants. If the step count is huge, detect a cycle with a seen-state map and fast-forward. The interviewer is grading readability as much as correctness.",
      problems: [[68, "Text Justification", "H"], [6, "Zigzag Conversion", "M"], [874, "Walking Robot Simulation", "M"], [885, "Spiral Matrix III", "M"], [957, "Prison Cells After N Days", "M"], [1275, "Find Winner on a Tic Tac Toe Game", "E"]],
      tools: ["Array & Dynamic Array", "String & String Builder", "Matrix / Grid"],
      blocks: ["Helper Functions & Closures", "While Loops", "Guard Clauses & Early Return", "Direction Arrays"]
    }],
    ["String Parsing & Tokenizing", "Scan characters with an index, build tokens, and use a stack or recursion for nesting: calculators, paths, decoders, routers.", {
      tier: "google",
      recognize: "Expressions, nested brackets like 3[a2[c]], file paths, URL or route patterns, atoi with edge cases. HTTP route matching is reported at Google.",
      idea: "One pointer walks the string; digits accumulate into a number, letters into a word, and an opening bracket pushes the current context onto a stack (or recurses). O(n) time. Recursive descent (expr → term → factor) handles precedence cleanly.",
      template: `def decode_string(s):
    stack, num, cur = [], 0, ""
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((cur, num))
            cur, num = "", 0
        elif ch == "]":
            prev, k = stack.pop()
            cur = prev + cur * k
        else:
            cur += ch
    return cur`,
      pitfalls: "Multi-digit numbers read one digit at a time; trailing token never flushed after the loop; string += in a loop being O(n²) in some languages (use a list and join)",
      staff: "For route matching, move from per-request regex scans to a trie of path segments with wildcard and param nodes, matching in O(segments). Discuss precedence (static > param > wildcard) and conflicting routes.",
      problems: [[394, "Decode String", "M"], [8, "String to Integer (atoi)", "M"], [71, "Simplify Path", "M"], [227, "Basic Calculator II", "M"], [722, "Remove Comments", "M"], [736, "Parse Lisp Expression", "H"], [null, "HTTP Route Matching", "M", "G"]],
      tools: ["Stack", "String & String Builder", "Trie"],
      blocks: ["Digit Loop", "If / Else Branching", "Loop-and-a-Half", "Recursive Case"]
    }],
    ["Expand Around Center", "Every palindrome mirrors around a center; try all 2n−1 centers and expand while both ends match.", {
      tier: "core",
      recognize: "Longest palindromic substring, count palindromic substrings, or checks that can tolerate one mismatch.",
      idea: "For each center (a character or the gap between two), expand l and r outward while s[l] == s[r]. O(n²) time, O(1) space, simpler than the DP table. Manacher's algorithm gets O(n).",
      template: `def longest_palindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r            # half-open [l+1, r)
    best = (0, 0)
    for i in range(len(s)):
        for l, r in (expand(i, i), expand(i, i + 1)):
            if r - l > best[1] - best[0]:
                best = (l, r)
    return s[best[0]:best[1]]`,
      pitfalls: "Only trying odd-length centers; returning the bounds from after the last failed expansion; building substrings inside the loop instead of tracking indices",
      staff: "Compare three options: DP table (O(n²) space), expand-around-center (O(1) space), and Manacher (O(n)). Mention a rolling hash plus binary search on length for very long strings.",
      problems: [[5, "Longest Palindromic Substring", "M"], [647, "Palindromic Substrings", "M"], [680, "Valid Palindrome II", "E"], [2472, "Maximum Number of Non-overlapping Palindrome Substrings", "H"]],
      tools: ["String & String Builder"],
      blocks: ["Helper Functions & Closures", "Bounds Checks", "Half-Open vs Closed Ranges"]
    }],
    ["Sort with a Custom Comparator", "Sorting first, often with a custom key, turns many problems into a single linear scan.", {
      tier: "core",
      recognize: "Order matters in a non-obvious way (concatenate to the largest number, logs ordering), or overlaps and conflicts are easier to see once sorted.",
      idea: "Sort by a key tuple, or by a pairwise rule via cmp_to_key when the order is defined by comparing two items (a+b vs b+a). The rule must be a strict weak ordering (transitive). O(n log n).",
      template: `from functools import cmp_to_key

def largest_number(nums):
    strs = [str(x) for x in nums]
    def cmp(a, b):
        if a + b > b + a: return -1
        if a + b < b + a: return 1
        return 0
    strs.sort(key=cmp_to_key(cmp))
    out = "".join(strs)
    return "0" if out[0] == "0" else out

def can_attend(intervals):
    intervals.sort(key=lambda iv: iv[0])
    return all(intervals[i][0] >= intervals[i - 1][1] for i in range(1, len(intervals)))`,
      pitfalls: "A comparator that isn't transitive, which gives inconsistent sorts; forgetting the '000' → '0' case; relying on stability without knowing whether your language's sort is stable",
      staff: "For data too large to sort in memory, use external merge sort (sorted runs + k-way merge). Explain when a counting or radix sort beats comparison sorting, and how key tuples handle tie-breaking.",
      problems: [[179, "Largest Number", "M"], [252, "Meeting Rooms", "E"], [937, "Reorder Data in Log Files", "M"], [1636, "Sort Array by Increasing Frequency", "E"], [791, "Custom Sort String", "M"], [1029, "Two City Scheduling", "M"]],
      tools: ["Comparison Sort & Comparators"],
      blocks: ["Comparators", "Tuple Comparison", "Tie-Breaking", "Stable Sort"]
    }],
    ["Coordinate Compression", "Map huge or sparse values to their ranks 0..k−1 so they can index arrays, Fenwick trees or segment trees.", {
      tier: "stretch",
      recognize: "Values up to 10^9 (or negative) but only n ≤ 10^5 distinct ones matter, before using a BIT, segment tree, or grid of interesting coordinates.",
      idea: "Sort the distinct values, then map each value to its index (dict or bisect). Order is preserved and the range shrinks to n. O(n log n).",
      template: `def compress(values):
    sorted_vals = sorted(set(values))
    rank = {v: i for i, v in enumerate(sorted_vals)}
    return [rank[v] for v in values], sorted_vals

def rank_transform(arr):
    rank = {v: i + 1 for i, v in enumerate(sorted(set(arr)))}
    return [rank[v] for v in arr]`,
      pitfalls: "Losing the original values needed to compute lengths or areas (keep sorted_vals); compressing only endpoints when the gaps between them matter; forgetting query values must be compressed too (compress offline)",
      staff: "Mention that compression needs all values up front (offline). For an online stream of new values, use a balanced BST or dynamic segment tree instead.",
      problems: [[1331, "Rank Transform of an Array", "E"], [315, "Count of Smaller Numbers After Self", "H"], [850, "Rectangle Area II", "H"], [2251, "Number of Flowers in Full Bloom", "H"]],
      tools: ["Comparison Sort & Comparators", "Hash Map", "Fenwick Tree", "bisect module"],
      blocks: ["Reduction / Transform", "Precomputation", "Zero-Based Indexing"]
    }]
  ]
});

PATTERNS.push({
  name: "Searching & Selection",
  blurb: "Halving a monotonic search space, or partitioning to find the k-th, instead of scanning or fully sorting.",
  items: [
    ["Lower & Upper Bound Boundaries", "Binary search for the first index where a predicate turns true; every sorted-array search is a variant of this one template.", {
      tier: "core",
      recognize: "Sorted input, 'first/last position', 'insert position', 'first bad version', square root by search.",
      idea: "Keep the half-open range [lo, hi) with the invariant pred(lo-1) false and pred(hi) true. Move to mid+1 or mid until lo == hi. O(log n). Lower bound = first x ≥ target; upper bound = first x > target.",
      template: `def lower_bound(nums, target):
    lo, hi = 0, len(nums)            # answer in [lo, hi]
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] >= target:
            hi = mid
        else:
            lo = mid + 1
    return lo                        # == len(nums) if none

def search_range(nums, t):
    l = lower_bound(nums, t)
    if l == len(nums) or nums[l] != t:
        return [-1, -1]
    return [l, lower_bound(nums, t + 1) - 1]`,
      pitfalls: "Mixing closed [lo, hi] bounds with hi = mid, which loops forever; mid overflow in fixed-width languages (use lo + (hi - lo) // 2); returning lo without checking it's in range and equal to the target",
      staff: "Say out loud which invariant you hold, since that is what makes the code bug-free without running it. For data on disk, the same idea becomes a B-tree descent, or binary search over block indices then within a block.",
      problems: [[704, "Binary Search", "E"], [35, "Search Insert Position", "E"], [34, "Find First and Last Position of Element in Sorted Array", "M"], [278, "First Bad Version", "E"], [69, "Sqrt(x)", "E"], [744, "Find Smallest Letter Greater Than Target", "E"], [981, "Time Based Key-Value Store", "M"]],
      tools: ["Binary Search", "bisect module"],
      blocks: ["Half-Open vs Closed Ranges", "Loop Invariants", "Integer Overflow & Safe Midpoint", "Off-by-One Errors"]
    }],
    ["Rotated & Bitonic Search", "In a rotated or mountain array, one half around mid is always sorted; decide which half can hold the target.", {
      tier: "core",
      recognize: "'Sorted then rotated', 'find minimum/pivot', 'peak element', 'mountain array'.",
      idea: "Compare nums[mid] with nums[hi] to find which side is sorted, then check whether the target lies inside that sorted side. For a peak, move toward the larger neighbour. O(log n); duplicates degrade the worst case to O(n).",
      template: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:                  # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                      # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      pitfalls: "Using < instead of <= in nums[lo] <= nums[mid] when lo == mid; with duplicates, nums[lo] == nums[mid] is ambiguous (shrink lo by one); comparing with nums[lo] when finding the minimum (compare with nums[hi])",
      staff: "Explain the O(n) worst case with duplicates and why no algorithm can beat it. Alternatively find the pivot first, then do a normal binary search on the right segment: two clean passes beat one clever one for readability.",
      problems: [[33, "Search in Rotated Sorted Array", "M"], [153, "Find Minimum in Rotated Sorted Array", "M"], [81, "Search in Rotated Sorted Array II", "M"], [154, "Find Minimum in Rotated Sorted Array II", "H"], [162, "Find Peak Element", "M"], [852, "Peak Index in a Mountain Array", "M"], [1095, "Find in Mountain Array", "H"]],
      tools: ["Binary Search"],
      blocks: ["If / Else Branching", "Loop Invariants", "Monotonicity", "Half-Open vs Closed Ranges"]
    }],
    ["Binary Search on the Answer", "When the answer space is monotonic, i.e. feasible(x) implies feasible(x+1), binary search the answer and test it with a greedy check.", {
      tier: "google",
      recognize: "'Minimise the maximum', 'maximise the minimum', 'smallest capacity/speed/time such that...', with constraints too big to try every value. Reported at Google: minimum time to finish tasks on N CPUs.",
      idea: "Pick bounds [lo, hi] that surely contain the answer, write feasible(x) (usually an O(n) greedy), and find the first x where it's true. O(n log(range)). The hard part is proving feasible is monotonic.",
      template: `def ship_within_days(weights, days):
    def feasible(cap):
        need, load = 1, 0
        for w in weights:
            if load + w > cap:
                need += 1
                load = 0
            load += w
        return need <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      pitfalls: "Lower bound too small (e.g. 0 or 1 instead of max(weights)), which makes feasible wrong; a non-monotonic predicate; real-valued answers need a fixed iteration count or epsilon, not lo < hi",
      staff: "The follow-up is usually the second question, e.g. 'now the fewest CPUs that hit that time', which is another binary search with a swapped predicate. feasible() is a single pass, so it streams or shards: each shard reports its local count and you sum them.",
      problems: [[875, "Koko Eating Bananas", "M"], [1011, "Capacity To Ship Packages Within D Days", "M"], [410, "Split Array Largest Sum", "H"], [1482, "Minimum Number of Days to Make m Bouquets", "M"], [2187, "Minimum Time to Complete Trips", "M"], [1552, "Magnetic Force Between Two Balls", "M"], [774, "Minimize Max Distance to Gas Station", "H"], [null, "Minimum Time to Finish Tasks on N CPUs", "M", "G"]],
      tools: ["Binary Search"],
      blocks: ["Monotonicity", "Helper Functions & Closures", "Greedy Choice", "Integer Division, Floor & Ceil"]
    }],
    ["Sorted Matrix Search", "Use the matrix's sort order: treat it as one flattened array, walk a staircase from a corner, or binary search on the value range.", {
      tier: "core",
      recognize: "A matrix whose rows (and columns) are sorted: search a target, k-th smallest, count negatives, multiplication tables.",
      idea: "Fully sorted (row-major): binary search index i maps to (i // n, i % n), O(log mn). Rows and columns sorted: start top-right and move left or down, O(m + n). k-th smallest: binary search the value and count how many are ≤ mid with a staircase walk, O((m + n) log range).",
      template: `def search_matrix_ii(matrix, target):
    r, c = 0, len(matrix[0]) - 1
    while r < len(matrix) and c >= 0:
        v = matrix[r][c]
        if v == target:
            return True
        if v > target:
            c -= 1
        else:
            r += 1
    return False

def kth_smallest(matrix, k):
    n = len(matrix)
    def count_le(x):
        cnt, c = 0, n - 1
        for row in matrix:
            while c >= 0 and row[c] > x:
                c -= 1
            cnt += c + 1
        return cnt
    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = (lo + hi) // 2
        if count_le(mid) >= k: hi = mid
        else: lo = mid + 1
    return lo`,
      pitfalls: "Starting the staircase at the top-left, where both moves increase the value; using / instead of // when mapping a flat index; assuming 240's matrix is fully row-major sorted",
      staff: "Give the three options for k-th smallest: heap (O(k log n)), value binary search (O(n log range)), and the theoretical O(n) Frederickson algorithm (name it, don't code it). Pick based on k versus n.",
      problems: [[74, "Search a 2D Matrix", "M"], [240, "Search a 2D Matrix II", "M"], [378, "Kth Smallest Element in a Sorted Matrix", "M"], [1351, "Count Negative Numbers in a Sorted Matrix", "E"], [668, "Kth Smallest Number in Multiplication Table", "H"]],
      tools: ["Binary Search", "Matrix / Grid", "Binary Heap"],
      blocks: ["Monotonicity", "Integer Division, Floor & Ceil", "Two-Index While Loop"]
    }],
    ["Partition Binary Search", "Binary search a cut position instead of a value: place a partition in one array so both sides together hold exactly k elements.", {
      tier: "stretch",
      recognize: "Median or k-th element of two sorted arrays in O(log(min(m, n))), or k-th smallest pair or fraction.",
      idea: "Choose i elements from A and k - i from B; the cut is valid when A[i-1] ≤ B[k-i] and B[k-i-1] ≤ A[i]. Binary search i over the shorter array, using ±inf sentinels at the edges. O(log min(m, n)).",
      template: `def find_median_sorted_arrays(a, b):
    if len(a) > len(b):
        a, b = b, a
    m, n = len(a), len(b)
    half = (m + n + 1) // 2
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i
        a_left = a[i - 1] if i > 0 else float("-inf")
        a_right = a[i] if i < m else float("inf")
        b_left = b[j - 1] if j > 0 else float("-inf")
        b_right = b[j] if j < n else float("inf")
        if a_left <= b_right and b_left <= a_right:
            if (m + n) % 2:
                return max(a_left, b_left)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        if a_left > b_right:
            hi = i - 1
        else:
            lo = i + 1`,
      pitfalls: "Searching the longer array, so j goes negative; forgetting the ±inf sentinels at the edges; an off-by-one in half for odd versus even totals",
      staff: "Name the simpler O(log(m + n)) 'discard k/2' recursion as a fallback you'd actually write under time pressure. For many sorted shards, binary search the value and count elements ≤ mid per shard.",
      problems: [[4, "Median of Two Sorted Arrays", "H"], [719, "Find K-th Smallest Pair Distance", "H"], [786, "K-th Smallest Prime Fraction", "M"], [null, "K-th Smallest Element of Two Sorted Arrays", "M"]],
      tools: ["Binary Search"],
      blocks: ["Sentinels", "Loop Invariants", "Integer Division, Floor & Ceil", "Guard Clauses & Early Return"]
    }],
    ["Quickselect / K-th Element", "Partition around a random pivot and recurse into one side only, giving the k-th smallest in expected O(n) without a full sort.", {
      tier: "google",
      recognize: "'K-th largest/smallest', 'k closest', 'median' on an unsorted array where you don't need the rest ordered. K-th largest is reported in Google L6 loops.",
      idea: "Lomuto or Hoare partition puts the pivot at its final index p. If p == k, done; otherwise recurse into the side holding k. Expected O(n), worst case O(n²); a random pivot (or median of medians) protects against the worst case. O(1) extra space iteratively.",
      template: `import random

def kth_largest(nums, k):
    target = len(nums) - k               # index in ascending order
    lo, hi = 0, len(nums) - 1
    while True:
        p = random.randint(lo, hi)
        nums[p], nums[hi] = nums[hi], nums[p]
        store = lo
        for i in range(lo, hi):
            if nums[i] < nums[hi]:
                nums[store], nums[i] = nums[i], nums[store]
                store += 1
        nums[store], nums[hi] = nums[hi], nums[store]
        if store == target:
            return nums[store]
        if store < target:
            lo = store + 1
        else:
            hi = store - 1`,
      pitfalls: "A fixed pivot hits O(n²) on sorted input; Lomuto degrades with many duplicates (use 3-way partition); confusing k-th largest with index k",
      staff: "Present all three: sort O(n log n), size-k min-heap O(n log k) (streams and handles data too large for memory), quickselect O(n) expected (needs all the data in memory and mutates it). For a distributed k-th, sample pivots or binary search the value with per-shard counts.",
      problems: [[215, "Kth Largest Element in an Array", "M"], [973, "K Closest Points to Origin", "M"], [347, "Top K Frequent Elements", "M"], [462, "Minimum Moves to Equal Array Elements II", "M"], [324, "Wiggle Sort II", "M"], [703, "Kth Largest Element in a Stream", "E"]],
      tools: ["Quickselect", "Partition Procedure", "Binary Heap", "heapq"],
      blocks: ["Randomization", "Divide & Conquer", "Swap", "Recurrences & Master Theorem"]
    }]
  ]
});
PATTERNS.push({
  name: "Linked Lists",
  layer: "Patterns",
  blurb: "Pointer rewiring without random access: speeds, reversal, dummy heads and node maps.",
  items: [
    ["Fast & Slow Pointers", "Two pointers moving at different speeds find cycles, cycle starts and midpoints in O(1) space.", {
      tier: "core",
      recognize: "Linked list or 'next index' function; asks for a cycle, its start, the middle node, or O(1) extra space where a set would be the obvious answer.",
      idea: "If a cycle exists the fast pointer gains one step per move and must land on the slow one. After they meet, a pointer reset to the head and one left at the meeting point, both stepping once, meet at the cycle start (distance from head = distance from meeting point, mod cycle length).",
      template: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p, slow = p.next, slow.next
            return p
    return None`,
      pitfalls: "Checking fast.next.next without first checking fast.next; comparing values instead of node identity; for the middle of an even list, know whether you need the first or second middle.",
      staff: "Find the Duplicate Number treats array values as next pointers, so the same proof works on an implicit graph. Be ready to prove the meeting-point math out loud, not just recite it.",
      problems: [[141, "Linked List Cycle", "E"], [142, "Linked List Cycle II", "M"], [876, "Middle of the Linked List", "E"], [234, "Palindrome Linked List", "E"], [287, "Find the Duplicate Number", "M"], [202, "Happy Number", "E"]],
      tools: ["Linked List"],
      blocks: ["While Loops", "Bounds Checks", "Loop Invariants", "Reference vs Copy"]
    }],
    ["In-Place Linked List Reversal", "Rewire next pointers with a prev/curr/next trio to reverse a whole list or a sub-range in O(1) space.", {
      tier: "core",
      recognize: "Reverse a list, a segment [m, n], every k nodes, or compare a list with its own reverse (palindrome, reorder).",
      idea: "At each step save curr.next, point curr back at prev, then advance both. Invariant: prev heads the already-reversed part, curr heads the untouched part. For sub-ranges, keep the node before the segment and the segment's first node so you can splice the reversed piece back.",
      template: `def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev

def reverse_between(head, left, right):
    dummy = ListNode(0, head)
    before = dummy
    for _ in range(left - 1):
        before = before.next
    prev, curr = None, before.next
    for _ in range(right - left + 1):
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    before.next.next = curr   # old segment head now tail
    before.next = prev
    return dummy.next`,
      pitfalls: "Losing the rest of the list by overwriting curr.next before saving it; forgetting to reconnect the reversed segment's tail; off-by-one when walking to position left.",
      staff: "Reverse Nodes in k-Group is the real test: write a helper that reverses exactly k nodes and returns (new_head, new_tail), then loop. Mention the recursive version costs O(n) stack.",
      problems: [[206, "Reverse Linked List", "E"], [92, "Reverse Linked List II", "M"], [24, "Swap Nodes in Pairs", "M"], [25, "Reverse Nodes in k-Group", "H"], [61, "Rotate List", "M"]],
      tools: ["Linked List"],
      blocks: ["Swap", "Loop Invariants", "Sentinels", "Off-by-One Errors", "Helper Functions & Closures"]
    }],
    ["Dummy Head, Merge & Splice", "A sentinel node in front of the result removes head special cases when merging, deleting or splitting lists.", {
      tier: "core",
      recognize: "The head itself might change (deletion, merge, partition), or you build a new list node by node.",
      idea: "Start with dummy = ListNode(0) and a tail pointer; append by tail.next = node; tail = node. Return dummy.next. Composite problems like Reorder List chain three primitives: find middle, reverse second half, interleave.",
      template: `def merge_two(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next

def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next`,
      pitfalls: "Forgetting to attach the leftover tail after a merge; using <= vs < breaks stability; gap of n vs n+1 in remove-nth; leaving a cycle when splitting a list (set mid.next = None).",
      staff: "Add Two Numbers: carry handling and the follow-up where digits are stored most-significant first (reverse or use stacks). Merging is also the core of merge sort on lists, O(n log n) with O(1) extra space.",
      problems: [[21, "Merge Two Sorted Lists", "E"], [19, "Remove Nth Node From End of List", "M"], [143, "Reorder List", "M"], [2, "Add Two Numbers", "M"], [86, "Partition List", "M"], [160, "Intersection of Two Linked Lists", "E"]],
      tools: ["Linked List", "Merge Procedure"],
      blocks: ["Sentinels", "Two-Index While Loop", "Guard Clauses & Early Return", "Off-by-One Errors"]
    }],
    ["Clone with Node Mapping", "Deep-copy a structure with extra pointers by mapping each original node to its copy.", {
      tier: "core",
      recognize: "Copy a list with random pointers, a graph, or any structure where nodes are shared or form cycles.",
      idea: "A hash map old -> new means every node is created exactly once and every pointer is redirected through the map. For the list, the O(1)-space variant weaves copies between originals (A, A', B, B'), sets randoms, then unweaves.",
      template: `def copy_random_list(head):
    if not head:
        return None
    clone = {None: None}
    node = head
    while node:
        clone[node] = Node(node.val)
        node = node.next
    node = head
    while node:
        clone[node].next = clone[node.next]
        clone[node].random = clone[node.random]
        node = node.next
    return clone[head]`,
      pitfalls: "Creating a node twice when it is reached by two pointers; forgetting the None -> None entry; in the interleaving variant, not restoring the original list.",
      staff: "Explain the trade-off: map is O(n) extra space and simple; interleaving is O(1) extra but mutates input temporarily, which matters if the structure is shared or read concurrently.",
      problems: [[138, "Copy List with Random Pointer", "M"], [133, "Clone Graph", "M"], [1490, "Clone N-ary Tree", "M"]],
      tools: ["Hash Map", "Linked List"],
      blocks: ["Two Pass", "Reference vs Copy", "Visited Markers"]
    }]
  ]
});

PATTERNS.push({
  name: "Stacks & Queues",
  layer: "Patterns",
  blurb: "LIFO for nesting and 'nearest' questions, deques for window extremes.",
  items: [
    ["Matching & Nesting with a Stack", "Push openers, pop on closers: brackets, nested encodings and path normalisation.", {
      tier: "core",
      recognize: "Balanced brackets, nested structures like k[abc], undo-style operations, or 'most recent unmatched' anything.",
      idea: "The stack holds the context you are still inside. A closer must match the top; the string is valid only if the stack ends empty. For nested decode, push (current_string, repeat_count) on '[' and pop to combine on ']'.",
      template: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack

def decode_string(s):
    stack, cur, num = [], '', 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == '[':
            stack.append((cur, num))
            cur, num = '', 0
        elif ch == ']':
            prev, k = stack.pop()
            cur = prev + cur * k
        else:
            cur += ch
    return cur`,
      pitfalls: "Popping an empty stack; forgetting the final 'stack is empty' check; multi-digit repeat counts; building strings with += in a hot loop (use a list and join).",
      staff: "Minimum Remove to Make Valid Parentheses: store indices, not characters, so you can delete exactly the unmatched ones. Longest Valid Parentheses: keep a base index at the bottom of the stack.",
      problems: [[20, "Valid Parentheses", "E"], [394, "Decode String", "M"], [71, "Simplify Path", "M"], [1249, "Minimum Remove to Make Valid Parentheses", "M"], [32, "Longest Valid Parentheses", "H"]],
      tools: ["Stack", "Hash Map", "String & String Builder"],
      blocks: ["Single Pass", "Guard Clauses & Early Return", "If / Else Branching", "Digit Loop"]
    }],
    ["Monotonic Stack: Next Greater", "Keep a stack of indices in increasing or decreasing order to answer next/previous greater or smaller in O(n).", {
      tier: "google",
      recognize: "'Next greater/smaller element', 'how many days until warmer', 'how far can each bar extend', 'who can see whom', or sums over all subarray minimums.",
      idea: "Each index is pushed once and popped once, so the whole scan is O(n). When the current value breaks the stack's order, every popped index has just found its answer (the current index). What remains on the stack has no answer yet.",
      template: `def next_greater(nums):
    ans = [-1] * len(nums)
    stack = []                       # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            ans[stack.pop()] = x
        stack.append(i)
    return ans

def largest_rectangle(heights):
    stack, best = [], 0
    for i, h in enumerate(heights + [0]):    # sentinel flushes the stack
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1
            best = max(best, height * (i - left - 1))
        stack.append(i)
    return best`,
      pitfalls: "Storing values instead of indices (you lose widths and distances); strict vs non-strict comparison double-counts duplicates in Sum of Subarray Minimums; forgetting the sentinel and leaving items unprocessed.",
      staff: "Google reports the 'people visible' question with a follow-up from 'count for the last person' to 'count for everyone'. That is the jump from one scan to a full monotonic stack. Explain amortised O(n): each element is pushed and popped at most once.",
      problems: [[739, "Daily Temperatures", "M"], [496, "Next Greater Element I", "E"], [503, "Next Greater Element II", "M"], [84, "Largest Rectangle in Histogram", "H"], [907, "Sum of Subarray Minimums", "M"], [1944, "Number of Visible People in a Queue", "H", "G"], [null, "Count People Visible to the Last Person", "M", "G"], [901, "Online Stock Span", "M"]],
      tools: ["Stack", "Array & Dynamic Array"],
      blocks: ["Amortized Analysis", "Sentinels", "Loop Invariants", "Monotonicity", "Single Pass"]
    }],
    ["Monotonic Deque: Window Max/Min", "A deque of indices in decreasing (or increasing) order gives the max (or min) of a sliding window in O(1) per step.", {
      tier: "google",
      recognize: "Max or min over every window of size k, windows whose max - min must stay under a limit, or DP where dp[i] needs the best of the last k states.",
      idea: "The front is always the window's best index. On each step: pop from the back any index whose value can never win again, push the new index, then pop the front if it has slid out of the window.",
      template: `from collections import deque

def max_sliding_window(nums, k):
    dq, out = deque(), []            # indices, values decreasing
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out`,
      pitfalls: "Expiring the front with the wrong boundary (i - k vs i - k + 1); storing values so you can't tell when they expire; emitting output before the first window is full.",
      staff: "Shortest Subarray with Sum at Least K combines prefix sums with an increasing deque because negatives break the plain sliding window. Jump Game VI and Constrained Subsequence Sum use the deque to speed up an O(nk) DP to O(n).",
      problems: [[239, "Sliding Window Maximum", "H"], [1438, "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", "M"], [862, "Shortest Subarray with Sum at Least K", "H"], [1696, "Jump Game VI", "M"], [1425, "Constrained Subsequence Sum", "H"]],
      tools: ["Deque", "collections: deque, Counter, defaultdict"],
      blocks: ["Amortized Analysis", "Monotonicity", "Off-by-One Errors", "Single Pass"]
    }],
    ["Expression Evaluation", "Parse and evaluate arithmetic with precedence, unary minus and parentheses using stacks or recursive descent.", {
      tier: "google",
      recognize: "Evaluate a string expression, a calculator, postfix (RPN) notation, or any small grammar with nested parentheses.",
      idea: "Without parentheses: keep a stack of signed terms; apply * and / immediately to the top, push + and - terms, sum at the end. With parentheses: recurse on '(' (or push the running result and sign), return on ')'. RPN is the simplest case: operands push, operators pop two.",
      template: `def calculate(s):
    i = 0
    def parse():
        nonlocal i
        stack, num, op = [], 0, '+'
        while i < len(s):
            ch = s[i]
            i += 1
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == '(':
                num = parse()
            if ch in '+-*/)' or i == len(s):
                if op == '+': stack.append(num)
                elif op == '-': stack.append(-num)
                elif op == '*': stack.append(stack.pop() * num)
                elif op == '/': stack.append(int(stack.pop() / num))
                op, num = ch, 0
                if ch == ')':
                    break
        return sum(stack)
    return parse()`,
      pitfalls: "Python // floors toward negative infinity but the problem wants truncation toward zero; skipping spaces; multi-digit numbers; applying the previous operator only when you reach the next one (and at end of input).",
      staff: "Interviewers grow this into a tokenizer + parser: variables, functions or new operators. A clean tokenize() then parse_expr/parse_term/parse_factor (recursive descent) scales better than one clever loop. Mention a shunting-yard alternative.",
      problems: [[150, "Evaluate Reverse Polish Notation", "M"], [227, "Basic Calculator II", "M"], [224, "Basic Calculator", "H"], [772, "Basic Calculator III", "H"]],
      tools: ["Stack", "String & String Builder"],
      blocks: ["Recursive Case", "Helper Functions & Closures", "Integer Division, Floor & Ceil", "Digit Loop", "If / Else Branching"]
    }]
  ]
});

PATTERNS.push({
  name: "Heaps",
  layer: "Patterns",
  blurb: "Cheap access to the current min or max: top-K, medians, merges and schedulers.",
  items: [
    ["Top-K Selection with a Heap", "Keep a size-k heap so the K largest, smallest or most frequent items cost O(n log k), not a full sort.", {
      tier: "core",
      recognize: "'K largest/smallest/closest/most frequent', especially when n is huge or data streams in and k is small.",
      idea: "For the K largest use a MIN-heap of size k: its root is the weakest member of the current top K, so anything bigger evicts it. Alternatives: bucket sort by frequency gives O(n); quickselect gives O(n) average without order.",
      template: `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    heap = []
    for num, freq in Counter(nums).items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]

def k_closest(points, k):
    heap = []                          # max-heap via negated distance
    for x, y in points:
        heapq.heappush(heap, (-(x * x + y * y), x, y))
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]`,
      pitfalls: "Using a max-heap of all n items (O(n log n)) when a size-k min-heap is enough; Python heapq is min-only so negate for max; tuples with unorderable second fields crash on ties; Top K Frequent Words needs reverse lexical order on ties.",
      staff: "Classic Google follow-up: 'the data doesn't fit in memory' or 'it's a stream across machines'. Answer: per-shard counts, then merge partial top-Ks (but exact global top-K needs full counts or a two-round protocol); approximate with Count-Min sketch + heap (heavy hitters).",
      problems: [[347, "Top K Frequent Elements", "M"], [215, "Kth Largest Element in an Array", "M", "G"], [973, "K Closest Points to Origin", "M"], [703, "Kth Largest Element in a Stream", "E"], [692, "Top K Frequent Words", "M"]],
      tools: ["Binary Heap", "heapq", "Counter / Frequency Map", "Counting / Bucket / Radix Sort", "Quickselect"],
      blocks: ["Space-Time Trade-off", "Tuple Comparison", "Tie-Breaking", "Big-O Time & Space"]
    }],
    ["Two Heaps: Running Median", "A max-heap for the lower half and a min-heap for the upper half keep the median at the roots.", {
      tier: "core",
      recognize: "Median of a stream, sliding window median, or any split of items into a 'small half' and 'large half' that must stay balanced (IPO: affordable vs not-yet-affordable).",
      idea: "Invariant: every value in low <= every value in high, and len(low) is len(high) or one more. Insert into low, move low's max to high, then rebalance if high grew larger. Median is low's root or the average of both roots.",
      template: `import heapq

class MedianFinder:
    def __init__(self):
        self.low = []    # max-heap (negated)
        self.high = []   # min-heap

    def add_num(self, num):
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2`,
      pitfalls: "Forgetting to negate on both push and read; skipping the cross-push so the ordering invariant breaks; integer vs float median; sliding windows need removals, which heaps can't do directly (see lazy deletion).",
      staff: "Follow-ups: 'all numbers are in 0..100' (counting array, O(1) median); '99% are in 0..100' (counting array plus overflow counters); 'distributed stream' (approximate quantiles such as t-digest, or bucketed histograms).",
      problems: [[295, "Find Median from Data Stream", "H"], [480, "Sliding Window Median", "H"], [502, "IPO", "H"]],
      tools: ["Binary Heap", "heapq"],
      blocks: ["Loop Invariants", "Pre & Postconditions", "Floating-Point Precision"]
    }],
    ["K-Way Merge with a Heap", "Merge K sorted sources by repeatedly taking the smallest head from a min-heap.", {
      tier: "core",
      recognize: "K sorted lists, arrays or streams; kth smallest across sorted rows; smallest range covering one element from each list; pairs with smallest sums.",
      idea: "Seed the heap with the first element of each source as (value, source_id, index). Pop the min, emit it, push that source's next element. The heap never holds more than K items, so total cost is O(N log K).",
      template: `import heapq

def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
      pitfalls: "Pushing raw nodes so equal values make Python compare ListNode objects (TypeError); including the source id as a tie-breaker fixes it; pushing all N items up front wastes the log K bound.",
      staff: "This is the merge phase of external merge sort: sort chunks that fit in RAM, write them out, then k-way merge with one buffered reader per chunk. The alternative divide-and-conquer pairwise merge is also O(N log K) and needs no heap.",
      problems: [[23, "Merge k Sorted Lists", "H"], [378, "Kth Smallest Element in a Sorted Matrix", "M"], [373, "Find K Pairs with Smallest Sums", "M"], [632, "Smallest Range Covering Elements from K Lists", "H"]],
      tools: ["Binary Heap", "heapq", "Merge Procedure", "Linked List"],
      blocks: ["Tuple Comparison", "Tie-Breaking", "Sentinels", "Big-O Time & Space"]
    }],
    ["Heap-Based Scheduling", "Simulate time with a heap of 'when things free up' or 'what to run next' to schedule rooms, CPUs and servers.", {
      tier: "google",
      recognize: "Rooms, servers or CPUs that become free at certain times; tasks with enqueue times and durations; cooldowns between identical tasks; 'minimum resources needed'.",
      idea: "Sort events by time. Keep a min-heap of end times (or of available resources keyed by id). Before handling an event, pop everything that has finished by now. Heap size at any moment = resources in use.",
      template: `import heapq

def min_meeting_rooms(intervals):
    intervals.sort()
    ends = []                         # end times of rooms in use
    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heapreplace(ends, end)
        else:
            heapq.heappush(ends, end)
    return len(ends)

def single_threaded_cpu(tasks):
    order = sorted(range(len(tasks)), key=lambda i: tasks[i][0])
    ready, out, t, j = [], [], 0, 0
    while len(out) < len(tasks):
        if not ready and t < tasks[order[j]][0]:
            t = tasks[order[j]][0]    # jump idle time
        while j < len(order) and tasks[order[j]][0] <= t:
            i = order[j]
            heapq.heappush(ready, (tasks[i][1], i))
            j += 1
        dur, i = heapq.heappop(ready)
        t += dur
        out.append(i)
    return out`,
      pitfalls: "Advancing time one tick at a time instead of jumping to the next event; < vs <= when a meeting ends exactly as another starts; tie-breaking by index when durations are equal.",
      staff: "Task Scheduler has a closed-form answer (max_freq - 1) * (n + 1) + count_of_max, so present the formula and the heap simulation with trade-offs. Meeting Rooms III adds a second heap of free room ids. Real schedulers need preemption and fairness.",
      problems: [[253, "Meeting Rooms II", "M", "G"], [621, "Task Scheduler", "M"], [1834, "Single-Threaded CPU", "M"], [1882, "Process Tasks Using Servers", "M"], [2402, "Meeting Rooms III", "H"], [502, "IPO", "H"]],
      tools: ["Binary Heap", "heapq", "Comparison Sort & Comparators"],
      blocks: ["Two-Index While Loop", "Tie-Breaking", "Tuple Comparison", "Greedy Choice"]
    }],
    ["Lazy-Deletion Heap", "Leave stale entries in the heap and discard them only when they surface at the top.", {
      tier: "stretch",
      recognize: "You need heap min/max but also need to delete or update arbitrary items (prices get corrected, windows slide, buildings end), and the language heap has no decrease-key or remove.",
      idea: "Record what is currently valid in a side map (latest price per timestamp, or a 'to delete' counter). On read, pop the top while it is stale. Each entry is popped at most once, so the cost is amortised O(log n).",
      template: `import heapq

class StockPrice:
    def __init__(self):
        self.price = {}
        self.latest = 0
        self.max_heap, self.min_heap = [], []

    def update(self, ts, p):
        self.price[ts] = p
        self.latest = max(self.latest, ts)
        heapq.heappush(self.max_heap, (-p, ts))
        heapq.heappush(self.min_heap, (p, ts))

    def maximum(self):
        while self.price[self.max_heap[0][1]] != -self.max_heap[0][0]:
            heapq.heappop(self.max_heap)          # stale entry
        return -self.max_heap[0][0]

    def minimum(self):
        while self.price[self.min_heap[0][1]] != self.min_heap[0][0]:
            heapq.heappop(self.min_heap)
        return self.min_heap[0][0]

    def current(self):
        return self.price[self.latest]`,
      pitfalls: "Reading the size of a lazy heap as the live count (it includes stale entries); forgetting to clean both heaps in the two-heaps median; heap growth is unbounded if updates are frequent and reads rare.",
      staff: "Contrast with a balanced BST or SortedList (true O(log n) delete) and with an indexed heap (decrease-key). Lazy deletion is the simplest choice to get right in 45 minutes; name the memory trade-off.",
      problems: [[2034, "Stock Price Fluctuation", "M"], [480, "Sliding Window Median", "H"], [218, "The Skyline Problem", "H"]],
      tools: ["Binary Heap", "heapq", "Hash Map", "Ordered Map / Sorted List"],
      blocks: ["Amortized Analysis", "While Loops", "Space-Time Trade-off"]
    }]
  ]
});

PATTERNS.push({
  name: "Intervals",
  layer: "Patterns",
  blurb: "Sort first, then overlaps become a single scan; sweep lines and ordered maps handle the rest.",
  items: [
    ["Merge & Insert Intervals", "Sort by start, then extend the last merged interval or start a new one.", {
      tier: "core",
      recognize: "Overlapping ranges to combine, insert a new range into a sorted list, check whether any two overlap, or intersect two interval lists.",
      idea: "After sorting by start, an interval overlaps the previous merged block only if start <= last_end, so one pass suffices. For insert into an already sorted list you need no sort: copy the ones entirely before, merge the overlapping run, copy the rest.",
      template: `def merge(intervals):
    intervals.sort(key=lambda iv: iv[0])
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

def insert(intervals, new):
    out, i, n = [], 0, len(intervals)
    while i < n and intervals[i][1] < new[0]:
        out.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= new[1]:
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    out.append(new)
    out.extend(intervals[i:])
    return out`,
      pitfalls: "Setting the merged end to the new end instead of max (a long interval can swallow later ones); deciding whether touching intervals [1,2],[2,3] count as overlapping; mutating input when the caller expects a copy.",
      staff: "Merge Intervals is reported in Google L5 and L6 loops. Expect follow-ups: intervals arrive as a stream (keep an ordered map, see Ordered-Map Intervals); too many intervals to sort in memory (external sort by start, then the same one-pass merge).",
      problems: [[56, "Merge Intervals", "M", "G"], [57, "Insert Interval", "M"], [252, "Meeting Rooms", "E"], [986, "Interval List Intersections", "M"]],
      tools: ["Comparison Sort & Comparators", "Array & Dynamic Array"],
      blocks: ["Running Best-So-Far", "Half-Open vs Closed Ranges", "Single Pass", "Two-Index While Loop"]
    }],
    ["Interval Scheduling: Greedy by End", "Sort by end time and always keep the interval that finishes first to maximise how many fit.", {
      tier: "core",
      recognize: "Maximum number of non-overlapping intervals, minimum removals to make them non-overlapping, minimum arrows/points to hit every interval, longest chain of pairs.",
      idea: "Exchange argument: whichever interval ends first leaves the most room for the rest, so swapping any optimal first choice for it never hurts. Keep a running 'last end'; take an interval only if its start is past it.",
      template: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda iv: iv[1])
    kept, last_end = 0, float('-inf')
    for start, end in intervals:
        if start >= last_end:
            kept += 1
            last_end = end
    return len(intervals) - kept

def find_min_arrow_shots(points):
    points.sort(key=lambda p: p[1])
    arrows, last = 0, float('-inf')
    for start, end in points:
        if start > last:            # closed intervals: touching counts
            arrows += 1
            last = end
    return arrows`,
      pitfalls: "Sorting by start instead of end (works for merging, fails here); > vs >= depends on whether endpoints touching count as overlap; using float('-inf') with integer-only code paths is fine but be explicit about it.",
      staff: "Be ready to prove the greedy choice with an exchange argument in two sentences. Weighted intervals (each has a value) break greedy and need DP + binary search (Maximum Profit in Job Scheduling).",
      problems: [[435, "Non-overlapping Intervals", "M"], [452, "Minimum Number of Arrows to Burst Balloons", "M"], [646, "Maximum Length of Pair Chain", "M"], [1353, "Maximum Number of Events That Can Be Attended", "M"]],
      tools: ["Comparison Sort & Comparators", "Binary Heap"],
      blocks: ["Greedy Choice", "Exchange Argument", "Sentinels", "Half-Open vs Closed Ranges"]
    }],
    ["Sweep Line Event Counting", "Turn intervals into +1/-1 events, sort them, and scan to find peak overlap, free time or outlines.", {
      tier: "google",
      recognize: "Maximum simultaneous intervals, capacity checks over time, free gaps shared by many schedules, outlines of overlapping rectangles (skyline), or counting how many intervals cover each point.",
      idea: "Each interval becomes (start, +1) and (end, -1). Sorted by time, a running sum gives the active count at every moment. Tie order matters: process ends before starts when intervals are half-open.",
      template: `def max_overlap(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    events.sort()                   # (t, -1) sorts before (t, +1)
    active = best = 0
    for _, delta in events:
        active += delta
        best = max(best, active)
    return best

def car_pooling(trips, capacity):
    events = []
    for passengers, start, end in trips:
        events += [(start, passengers), (end, -passengers)]
    load = 0
    for _, delta in sorted(events):
        load += delta
        if load > capacity:
            return False
    return True`,
      pitfalls: "Wrong tie order double-counts intervals that touch; forgetting that bounded coordinates allow a difference array (no sort); Skyline needs a heap or ordered map of active heights, not just a counter.",
      staff: "Compare three equivalent tools: sort events O(n log n); difference array O(n + range) when coordinates are small; heap of end times. Employee Free Time is k-way merge plus sweep, which tests whether you combine patterns.",
      problems: [[253, "Meeting Rooms II", "M", "G"], [1094, "Car Pooling", "M"], [2406, "Divide Intervals Into Minimum Number of Groups", "M"], [759, "Employee Free Time", "H"], [218, "The Skyline Problem", "H"]],
      tools: ["Comparison Sort & Comparators", "Binary Heap", "Ordered Map / Sorted List"],
      blocks: ["Tuple Comparison", "Tie-Breaking", "Accumulators", "Running Best-So-Far", "Half-Open vs Closed Ranges"]
    }],
    ["Ordered-Map Intervals", "Keep intervals in a sorted map and use floor/ceiling lookups to book, merge or query ranges online.", {
      tier: "google",
      recognize: "Intervals arrive one at a time and each must be accepted/rejected or merged immediately: calendars, range modules, disjoint intervals from a stream.",
      idea: "Store intervals keyed by start in a sorted structure. A new [s, e) can only collide with its predecessor (the largest start <= s) and successors whose start < e. bisect finds both in O(log n); merges remove a contiguous run.",
      template: `from bisect import bisect_right

class MyCalendar:
    def __init__(self):
        self.starts, self.ends = [], []   # parallel sorted lists

    def book(self, s, e):
        i = bisect_right(self.starts, s)
        if i > 0 and self.ends[i - 1] > s:          # predecessor overlaps
            return False
        if i < len(self.starts) and self.starts[i] < e:   # successor overlaps
            return False
        self.starts.insert(i, s)
        self.ends.insert(i, e)
        return True`,
      pitfalls: "list.insert is O(n), so say plainly that a balanced BST or sortedcontainers.SortedList makes it O(log n); half-open [s, e) boundaries; My Calendar II/III need overlap counts (sweep map or segment tree), not just a sorted set.",
      staff: "State which structure you'd use in production: TreeMap in Java, SortedList in Python, or a segment tree when the coordinate range is bounded. Data Stream as Disjoint Intervals asks you to trade insert cost against query cost.",
      problems: [[729, "My Calendar I", "M"], [731, "My Calendar II", "M"], [732, "My Calendar III", "H"], [352, "Data Stream as Disjoint Intervals", "H"], [715, "Range Module", "H"]],
      tools: ["Ordered Map / Sorted List", "bisect module", "sortedcontainers", "Segment Tree"],
      blocks: ["Half-Open vs Closed Ranges", "Bounds Checks", "Space-Time Trade-off"]
    }]
  ]
});

PATTERNS.push({
  name: "Trees",
  layer: "Patterns",
  blurb: "Recursive decomposition: push state down, return results up, or walk level by level.",
  items: [
    ["Top-Down DFS: Passing State Down", "Carry information from the root (bounds, running sum, max so far) into each recursive call.", {
      tier: "core",
      recognize: "Each node's answer depends on its ancestors: valid BST bounds, root-to-leaf sums, 'good' nodes with no larger ancestor, numbers formed along a path.",
      idea: "Pre-order: decide at the node using the state you were given, then pass an updated copy of that state to each child. Immutable parameters (ints, tuples) mean nothing needs undoing; mutable paths need append/pop.",
      template: `def is_valid_bst(root):
    def dfs(node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):
            return False
        return dfs(node.left, lo, node.val) and dfs(node.right, node.val, hi)
    return dfs(root, float('-inf'), float('inf'))

def path_sum_all(root, target):
    out, path = [], []
    def dfs(node, remaining):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right and remaining == node.val:
            out.append(path[:])               # copy the path
        dfs(node.left, remaining - node.val)
        dfs(node.right, remaining - node.val)
        path.pop()
    dfs(root, target)
    return out`,
      pitfalls: "Validating a BST by comparing only with direct children (fails on deep violations); appending the live path list instead of a copy; treating a node with one child as a leaf.",
      staff: "Skewed trees with 10^5 nodes overflow Python's recursion limit. Show the iterative version with an explicit stack of (node, state) tuples, and say why it's equivalent.",
      problems: [[98, "Validate Binary Search Tree", "M"], [112, "Path Sum", "E"], [113, "Path Sum II", "M"], [1448, "Count Good Nodes in Binary Tree", "M"], [129, "Sum Root to Leaf Numbers", "M"]],
      tools: ["Binary Tree", "Depth-First Search"],
      blocks: ["Base Case", "Recursive Case", "Return Value vs Accumulator Parameter", "Copying the Path in Backtracking", "Sentinels"]
    }],
    ["Bottom-Up DFS: Return Plus Global", "Each call returns what its parent needs while a shared variable records the best answer seen anywhere.", {
      tier: "core",
      recognize: "The answer at a node combines results from both subtrees: height, diameter, balance, max path sum, same/subtree checks, inversion.",
      idea: "Post-order: get left and right results first, then combine. Often the value you return (best single branch, height) differs from the value you record globally (path through this node using both branches). Separate the two explicitly.",
      template: `def max_path_sum(root):
    best = float('-inf')
    def gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(gain(node.left), 0)     # drop negative branches
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)   # path bends here
        return node.val + max(left, right)          # parent can use one side
    gain(root)
    return best

def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      pitfalls: "Returning the two-branch sum to the parent (a path can't fork); initialising best to 0 when all values are negative; Subtree of Another Tree is O(m*n) naively, so mention serialisation + string matching or hashing for O(m+n).",
      staff: "Name the pattern out loud: 'post-order, return X, track Y globally'. It covers Diameter, Max Path Sum, Balanced and Binary Tree Cameras, and interviewers reward that recognition over memorised code.",
      problems: [[104, "Maximum Depth of Binary Tree", "E"], [100, "Same Tree", "E"], [226, "Invert Binary Tree", "E"], [572, "Subtree of Another Tree", "E"], [110, "Balanced Binary Tree", "E"], [543, "Diameter of Binary Tree", "E"], [124, "Binary Tree Maximum Path Sum", "H"]],
      tools: ["Binary Tree", "Depth-First Search"],
      blocks: ["Base Case", "Recursive Case", "Helper Functions & Closures", "Running Best-So-Far", "Recursion Stack Space"]
    }],
    ["Level-Order BFS", "Process a tree one level at a time with a queue, snapshotting the level size before each round.", {
      tier: "core",
      recognize: "Anything per level: level lists, right-side view, zigzag, averages, minimum depth (first leaf found), width of a level.",
      idea: "Record len(queue) at the start of each round and pop exactly that many: they are the whole current level, and their children form the next. BFS finds the shallowest leaf first, so minimum depth can stop early.",
      template: `from collections import deque

def level_order(root):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        out.append(level)
    return out`,
      pitfalls: "Using list.pop(0), which is O(n) (use deque); reading len(q) inside the loop after children were added; Maximum Width needs position indices (2i, 2i+1), normalised per level to avoid huge numbers.",
      staff: "Explain when BFS beats DFS (shallow answer in a deep or unbalanced tree; memory is O(width) vs O(height)). Right-side view can also be done with DFS visiting right first, so show both.",
      problems: [[102, "Binary Tree Level Order Traversal", "M"], [199, "Binary Tree Right Side View", "M"], [103, "Binary Tree Zigzag Level Order Traversal", "M"], [111, "Minimum Depth of Binary Tree", "E"], [637, "Average of Levels in Binary Tree", "E"], [662, "Maximum Width of Binary Tree", "M"]],
      tools: ["Queue", "Binary Tree", "Breadth-First Search", "collections: deque, Counter, defaultdict"],
      blocks: ["While Loops", "Nested Loops", "Big-O Time & Space"]
    }],
    ["BST Ordering & Iterator", "In-order traversal of a BST is sorted; exploit that for k-th smallest, successors, deletes and lazy iterators.", {
      tier: "core",
      recognize: "The tree is a BST and the question involves order: k-th smallest, next larger value, range queries, deleting a node, or iterating values in sorted order.",
      idea: "Iterative in-order with a stack: push the left spine, pop a node (that's the next value), then push the left spine of its right child. Each node is pushed once, so next() is amortised O(1) with O(h) memory.",
      template: `class BSTIterator:
    def __init__(self, root):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left

    def next(self):
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val

    def has_next(self):
        return bool(self.stack)

def kth_smallest(root, k):
    it = BSTIterator(root)
    for _ in range(k - 1):
        it.next()
    return it.next()`,
      pitfalls: "Doing a full in-order into a list (O(n) memory) when the iterator needs only O(h); deleting a node with two children (replace with in-order successor, then delete that); assuming the BST is balanced when giving complexity.",
      staff: "Follow-up for Kth Smallest: 'the BST is modified often and k-th is queried often'. Store subtree sizes in each node (order-statistic tree) for O(h) queries. Lowest Common Ancestor of a BST is a walk, not a search.",
      problems: [[230, "Kth Smallest Element in a BST", "M"], [173, "Binary Search Tree Iterator", "M"], [285, "Inorder Successor in BST", "M"], [450, "Delete Node in a BST", "M"], [98, "Validate Binary Search Tree", "M"]],
      tools: ["Binary Search Tree", "Stack"],
      blocks: ["Recursion to Explicit Stack", "Amortized Analysis", "While Loops", "Loop Invariants"]
    }],
    ["Lowest Common Ancestor", "Find the deepest node that has both targets in its subtree, using a post-order search, BST walk or parent pointers.", {
      tier: "google",
      recognize: "Shared ancestor of two nodes, distance between two nodes, or questions about the 'meeting point' of two paths in a tree.",
      idea: "General binary tree: return the node if it is p or q; otherwise recurse both sides. If both sides return non-null, this node is the LCA. BST: walk down, going left if both are smaller and right if both are larger. With parent pointers it is the intersection of two linked lists.",
      template: `def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left or right

def lca_bst(root, p, q):
    node = root
    while node:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node

def lca_with_parents(p, q):         # same as list intersection
    a, b = p, q
    while a is not b:
        a = a.parent if a else q
        b = b.parent if b else p
    return a`,
      pitfalls: "The basic version assumes both nodes exist; if one may be missing, track found flags; comparing values when values aren't unique; the BST walk needs the BST property, not just any tree.",
      staff: "LCA is reported in Google L6 loops. Strong follow-ups: many queries on a static tree (binary lifting, O(log n) per query); distance between nodes = depth(p) + depth(q) - 2*depth(lca).",
      problems: [[236, "Lowest Common Ancestor of a Binary Tree", "M", "G"], [235, "Lowest Common Ancestor of a Binary Search Tree", "M"], [1650, "Lowest Common Ancestor of a Binary Tree III", "M"], [1123, "Lowest Common Ancestor of Deepest Leaves", "M"]],
      tools: ["Binary Tree", "Binary Search Tree", "Depth-First Search"],
      blocks: ["Base Case", "Guard Clauses & Early Return", "Recursive Case", "Pre & Postconditions"]
    }],
    ["Build Tree from Traversals", "Rebuild a tree from preorder/inorder (or postorder) by using the root to split the other traversal.", {
      tier: "core",
      recognize: "You are given two traversals (or one traversal of a BST) and asked to reconstruct the tree.",
      idea: "Preorder's first value is the root; its position in inorder splits left and right subtrees, and the left subtree's size tells you how far to advance in preorder. A value -> index map makes each split O(1), so the whole build is O(n).",
      template: `def build_tree(preorder, inorder):
    index = {v: i for i, v in enumerate(inorder)}
    pre = iter(preorder)

    def build(lo, hi):              # inorder[lo:hi] half-open
        if lo >= hi:
            return None
        val = next(pre)
        node = TreeNode(val)
        mid = index[val]
        node.left = build(lo, mid)
        node.right = build(mid + 1, hi)
        return node

    return build(0, len(inorder))`,
      pitfalls: "Slicing arrays at every call (O(n^2) time and memory); building right before left when consuming preorder (or left before right with postorder from the end); duplicate values make the split ambiguous.",
      staff: "Explain why preorder + postorder is not enough for a unique binary tree (only for full trees), and why a BST needs only preorder (bounds-based O(n) build).",
      problems: [[105, "Construct Binary Tree from Preorder and Inorder Traversal", "M"], [106, "Construct Binary Tree from Inorder and Postorder Traversal", "M"], [1008, "Construct Binary Search Tree from Preorder Traversal", "M"]],
      tools: ["Binary Tree", "Hash Map"],
      blocks: ["Half-Open vs Closed Ranges", "Divide & Conquer", "Precomputation", "Base Case"]
    }],
    ["Serialize & Encode Structures", "Flatten a tree or list of strings into one string that decodes back unambiguously.", {
      tier: "core",
      recognize: "Send a tree, list of strings or nested structure over a wire or store it, then rebuild it exactly.",
      idea: "The encoding must be lossless. Trees: preorder with explicit null markers, decoded by consuming tokens in the same order. String lists: length-prefix each item ('5#hello') so any characters, including the delimiter, are safe.",
      template: `def serialize(root):
    out = []
    def dfs(node):
        if not node:
            out.append('#')
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ','.join(out)

def deserialize(data):
    tokens = iter(data.split(','))
    def build():
        tok = next(tokens)
        if tok == '#':
            return None
        node = TreeNode(int(tok))
        node.left = build()
        node.right = build()
        return node
    return build()

def encode(strs):
    return ''.join(str(len(s)) + '#' + s for s in strs)

def decode(s):
    out, i = [], 0
    while i < len(s):
        j = s.index('#', i)
        n = int(s[i:j])
        out.append(s[j + 1:j + 1 + n])
        i = j + 1 + n
    return out`,
      pitfalls: "Omitting null markers (shape becomes ambiguous); delimiter-only string encoding breaks when a string contains the delimiter; negative and multi-digit values; recursion depth on deep trees.",
      staff: "Discuss format trade-offs like a staff engineer: compactness (BST needs no null markers), streaming decode, versioning and backwards compatibility. These are the same concerns as protobuf vs JSON in system design.",
      problems: [[297, "Serialize and Deserialize Binary Tree", "H"], [271, "Encode and Decode Strings", "M"], [449, "Serialize and Deserialize BST", "M"]],
      tools: ["Binary Tree", "String & String Builder", "Depth-First Search"],
      blocks: ["Base Case", "Helper Functions & Closures", "Pre & Postconditions", "Digit Loop"]
    }],
    ["Tree Path Prefix Sums", "Count downward paths with a given sum using a running prefix sum and a hash map of sums seen on the current root path.", {
      tier: "google",
      recognize: "Number of paths (not necessarily from the root or to a leaf) going downward whose sum equals a target, or falls within a range.",
      idea: "It is Subarray Sum Equals K on every root-to-node path. Keep counts of prefix sums on the current path. At a node with running sum S, paths ending here with sum K = count[S - K]. Add S before recursing, remove it after (backtrack).",
      template: `from collections import defaultdict

def path_sum_iii(root, target):
    count = defaultdict(int)
    count[0] = 1
    def dfs(node, running):
        if not node:
            return 0
        running += node.val
        total = count[running - target]
        count[running] += 1
        total += dfs(node.left, running) + dfs(node.right, running)
        count[running] -= 1            # leave this path
        return total
    return dfs(root, 0)`,
      pitfalls: "Forgetting count[0] = 1 (paths that start at the root); not decrementing on the way back, so sums leak across branches; counting before vs after adding the current sum.",
      staff: "Google reports a range variant: paths whose sum is in [lmin, lmax]. A hash map no longer works; keep path prefix sums in a sorted structure and count with two bisects (O(n log^2 n) with SortedList), or discuss the trade-off against an O(n * depth) scan.",
      problems: [[437, "Path Sum III", "M"], [null, "Tree Path Sum Within a Range", "M", "G"], [560, "Subarray Sum Equals K", "M"]],
      tools: ["Hash Map", "Binary Tree", "Depth-First Search", "Ordered Map / Sorted List"],
      blocks: ["Precomputation", "Copying the Path in Backtracking", "Accumulators", "Reduction / Transform"]
    }],
    ["Tree as Graph: Parent Map + BFS", "Add parent links to a tree so you can BFS outward from any node in every direction.", {
      tier: "google",
      recognize: "Distance from a target node (not the root), spreading or infection from a node, nearest leaf to a node: anything that needs to move up as well as down.",
      idea: "One DFS records each node's parent, turning the tree into an undirected graph. Then BFS from the start node over left, right and parent, with a visited set, so each ring of the BFS is one more unit of distance.",
      template: `from collections import deque

def distance_k(root, target, k):
    parent = {root: None}
    stack = [root]
    while stack:
        node = stack.pop()
        for child in (node.left, node.right):
            if child:
                parent[child] = node
                stack.append(child)
    q, seen, dist = deque([target]), {target}, 0
    while q and dist < k:
        for _ in range(len(q)):
            node = q.popleft()
            for nb in (node.left, node.right, parent[node]):
                if nb and nb not in seen:
                    seen.add(nb)
                    q.append(nb)
        dist += 1
    return [node.val for node in q]`,
      pitfalls: "Forgetting the visited set, so BFS bounces between parent and child forever; using values as keys when values repeat (use nodes); the parent of root is None.",
      staff: "Point out the general move: reframe a constrained structure as a graph and reuse BFS. Amount of Time for Binary Tree to Be Infected is the same code returning the number of levels.",
      problems: [[863, "All Nodes Distance K in Binary Tree", "M"], [2385, "Amount of Time for Binary Tree to Be Infected", "M"], [742, "Closest Leaf in a Binary Tree", "M"]],
      tools: ["Hash Map", "Queue", "Breadth-First Search", "Graph Representations"],
      blocks: ["Visited Markers", "Two Pass", "Reduction / Transform", "Nested Loops"]
    }],
    ["Rerooting DP", "Compute an answer for every possible root in O(n) by reusing the parent's answer when moving the root to a child.", {
      tier: "stretch",
      recognize: "'For every node, the sum of distances to all others', 'which roots give minimum height', or any per-root aggregate where n-times DFS would be O(n^2).",
      idea: "Pass 1 (post-order) computes subtree sizes and the answer for root 0. Pass 2 (pre-order) moves the root across each edge: for Sum of Distances, ans[child] = ans[parent] - size[child] + (n - size[child]), since nodes in the child's subtree get one closer and all others one farther.",
      template: `from collections import defaultdict

def sum_of_distances(n, edges):
    g = defaultdict(list)
    for a, b in edges:
        g[a].append(b); g[b].append(a)
    size, ans = [1] * n, [0] * n

    def down(u, p):                 # subtree sizes, ans for root 0
        for v in g[u]:
            if v != p:
                down(v, u)
                size[u] += size[v]
                ans[0] += size[v]   # every node below v is 1 deeper

    def reroot(u, p):
        for v in g[u]:
            if v != p:
                ans[v] = ans[u] - size[v] + (n - size[v])
                reroot(v, u)

    down(0, -1)
    reroot(0, -1)
    return ans`,
      pitfalls: "Recursion depth on a path graph of 3 * 10^4 nodes (go iterative or raise the limit); confusing the 'down' quantity with the full answer; forgetting the tree is undirected, so you must skip the parent.",
      staff: "Minimum Height Trees has a simpler alternative (peel leaves layer by layer until 1 or 2 remain), so present both and say why rerooting generalises to other aggregates.",
      problems: [[834, "Sum of Distances in Tree", "H"], [310, "Minimum Height Trees", "M"]],
      tools: ["Graph Representations", "Depth-First Search"],
      blocks: ["Two Pass", "Dynamic Programming", "Recursion to Explicit Stack", "Induction"]
    }],
    ["Binary Lifting: K-th Ancestor", "Precompute 2^j-th ancestors so k-th ancestor and LCA queries take O(log n).", {
      tier: "awareness",
      recognize: "Many ancestor or LCA queries on a fixed tree, or jumping k steps along any functional graph quickly.",
      idea: "up[j][v] = up[j-1][ up[j-1][v] ] is the 2^j-th ancestor. To jump k steps, decompose k into binary and apply the matching jumps. O(n log n) preprocessing, O(log n) per query.",
      template: `class TreeAncestor:
    def __init__(self, n, parent):
        self.LOG = max(1, n.bit_length())
        self.up = [parent[:]]
        for j in range(1, self.LOG):
            prev = self.up[-1]
            self.up.append([prev[prev[v]] if prev[v] != -1 else -1
                            for v in range(n)])

    def get_kth_ancestor(self, node, k):
        for j in range(self.LOG):
            if node == -1:
                break
            if k >> j & 1:
                node = self.up[j][node]
        return node`,
      pitfalls: "Not propagating -1 (no ancestor) through the table; choosing LOG too small; using it when a single query would be cheaper with a plain walk.",
      staff: "Mostly a follow-up answer: 'LCA, but with a million queries on a static tree'. Mention alternatives: Euler tour + sparse table for O(1) LCA, or offline Tarjan LCA with union-find.",
      problems: [[1483, "Kth Ancestor of a Tree Node", "H"]],
      tools: ["Sparse Table", "Bitset / Bitmask"],
      blocks: ["Precomputation", "Bit Loop", "Space-Time Trade-off", "Dynamic Programming"]
    }]
  ]
});
PATTERNS.push({
  name: "Graphs",
  layer: "Patterns",
  blurb: "Google's heaviest area: model the problem as nodes and edges, then pick the traversal that matches the question.",
  items: [
    ["Grid Flood Fill & Islands", "Treat each cell as a node and its 4 neighbours as edges; one DFS or BFS per unvisited land cell marks one whole component.", {
      tier: "core",
      recognize: "A 2D grid of land/water or colours, and the question is how many regions, how big the largest is, or whether a region touches the border.",
      idea: "Scan every cell. When you hit unvisited land, start a traversal that marks its whole component, then count it. Every cell is visited once, so it runs in O(R*C). Closed-island and enclave problems flood from the border first, then count what is left.",
      template: `def num_islands(grid):
    R, C = len(grid), len(grid[0])
    seen = set()
    def dfs(r, c):
        stack = [(r, c)]
        seen.add((r, c))
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == "1" and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    stack.append((nr, nc))
    count = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == "1" and (r, c) not in seen:
                dfs(r, c)
                count += 1
    return count`,
      pitfalls: "Marking a cell visited when you pop it instead of when you push it, so cells get queued twice. Recursive DFS overflowing the stack on a 1000x1000 grid. Mutating the input grid without saying so. Distinct-island shape keys that forget to normalise relative to the start cell.",
      staff: "If the grid is too large for memory, stream it row by row and keep only the previous row's component labels in a union-find. Union with the row above and to the left, and count a component as finished when no cell in the current row belongs to it. Memory is O(C). If land arrives as a stream of add-land operations, switch to union-find (Number of Islands II).",
      problems: [
        [200, "Number of Islands", "M"],
        [1254, "Number of Closed Islands", "M"],
        [695, "Max Area of Island", "M"],
        [694, "Number of Distinct Islands", "M"],
        [1020, "Number of Enclaves", "M"],
        [null, "Number of Islands: Grid Too Large for Memory", "M", "G"]
      ],
      tools: ["Matrix / Grid", "Depth-First Search", "Breadth-First Search", "Hash Set", "Union-Find"],
      blocks: ["Direction Arrays", "Bounds Checks", "Visited Markers", "Nested Loops", "Recursion to Explicit Stack"]
    }],
    ["Multi-Source BFS", "Seed the queue with every source at once, so each cell's BFS distance is its distance to the nearest source.", {
      tier: "core",
      recognize: "The question asks for the distance to the nearest of many sources, or for time steps of something spreading (rot, fire, water) from several starting points. Or it asks which cells can reach a border.",
      idea: "Pushing every source at distance 0 is the same as adding a virtual super-source joined to all of them. BFS levels then equal the distance to the nearest source, in a single O(R*C) pass. To check reachability to a border, reverse the flow: start from the border and climb uphill.",
      template: `from collections import deque
def nearest_distance(grid):
    R, C = len(grid), len(grid[0])
    dist = [[-1] * C for _ in range(R)]
    q = deque()
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 0:
                dist[r][c] = 0
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return dist`,
      pitfalls: "Running one BFS per source, which is O(k*R*C). Counting minutes off by one, since the last level adds no time. Forgetting the case where some fresh cell can never be reached, which should return -1.",
      staff: "Pacific Atlantic generalises to 'which nodes can reach set A and set B'. Run two reverse searches and intersect the results. On a sharded grid, run BFS in rounds: each shard expands its frontier locally, then exchanges boundary cells with its neighbours, like synchronous Pregel supersteps.",
      problems: [
        [994, "Rotting Oranges", "M"],
        [286, "Walls and Gates", "M"],
        [542, "01 Matrix", "M"],
        [417, "Pacific Atlantic Water Flow", "M"],
        [1162, "As Far from Land as Possible", "M"]
      ],
      tools: ["Breadth-First Search", "Queue", "collections: deque, Counter, defaultdict", "Matrix / Grid"],
      blocks: ["Direction Arrays", "Bounds Checks", "Visited Markers", "Reduction / Transform"]
    }],
    ["BFS on Implicit State Graphs", "When the moves are uniform-cost, BFS over states finds the fewest steps; the hard part is choosing what a state is.", {
      tier: "google",
      recognize: "Minimum number of moves, steps or transformations: lock dials, word ladders, sliding puzzles, a grid where you can remove k obstacles, collecting keys. Nothing is weighted.",
      idea: "A node is the full state: position plus whatever changes what moves you can make next (obstacles left, keys held as a bitmask, board string). Edges are the legal moves. BFS reaches each state first at its shortest distance. Cost is O(states x moves per state), so bound the state space before you code.",
      template: `from collections import deque
def min_steps(start, is_goal, neighbors):
    q = deque([(start, 0)])
    seen = {start}
    while q:
        state, d = q.popleft()
        if is_goal(state):
            return d
        for nxt in neighbors(state):
            if nxt not in seen:
                seen.add(nxt)
                q.append((nxt, d + 1))
    return -1

# Grid with k removals: state = (r, c, k_left)
# Keys: state = (r, c, keys_bitmask)`,
      pitfalls: "Leaving part of the state out of the visited key (for example (r, c) without k_left), which wrongly prunes better paths. Using lists as states, which aren't hashable. Generating neighbour words by comparing against every dictionary word at O(N^2*L) instead of using wildcard buckets.",
      staff: "Estimate the state count out loud first, e.g. R*C*(k+1) or R*C*2^keys. If it's too big, propose bidirectional BFS or A* with an admissible heuristic like Manhattan distance. In Word Ladder, precompute wildcard buckets ('h*t' -> [hot, hit]) so finding neighbours costs O(L) map lookups.",
      problems: [
        [127, "Word Ladder", "H", "G"],
        [752, "Open the Lock", "M"],
        [773, "Sliding Puzzle", "H"],
        [1293, "Shortest Path in a Grid with Obstacles Elimination", "H", "G"],
        [864, "Shortest Path to Get All Keys", "H"],
        [1091, "Shortest Path in Binary Matrix", "M"]
      ],
      tools: ["Breadth-First Search", "Queue", "Hash Set", "Bitset / Bitmask"],
      blocks: ["Hashable Keys", "Visited Markers", "Constraints to Complexity", "Reduction / Transform"]
    }],
    ["0-1 BFS with a Deque", "When edges cost only 0 or 1, push 0-edges to the front and 1-edges to the back to get Dijkstra results in O(V + E).", {
      tier: "stretch",
      recognize: "Shortest path where some moves are free and others cost 1: following an arrow vs changing it, walking empty cells vs removing an obstacle.",
      idea: "The deque always holds nodes at distance d at the front and d+1 at the back, so it acts like a two-bucket priority queue. Relax as in Dijkstra: if dist[v] improves, push v to the front for a 0-edge or to the back for a 1-edge.",
      template: `from collections import deque
def zero_one_bfs(n, adj, src):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    dq = deque([src])
    while dq:
        u = dq.popleft()
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    return dist`,
      pitfalls: "Using a plain visited set as in BFS. A node can improve after it is first seen, so compare distances instead. Applying it to weights other than 0 and 1.",
      staff: "Generalise to Dial's algorithm (bucket queue) when weights are small integers up to W, giving O(V*W + E). Explain why that beats a heap here.",
      problems: [
        [1368, "Minimum Cost to Make at Least One Valid Path in a Grid", "H"],
        [2290, "Minimum Obstacle Removal to Reach Corner", "H"],
        [1263, "Minimum Moves to Move a Box to Their Target Location", "H"]
      ],
      tools: ["Deque", "collections: deque, Counter, defaultdict", "Breadth-First Search", "Graph Representations"],
      blocks: ["Loop Invariants", "Sentinels", "Direction Arrays"]
    }],
    ["Bidirectional BFS", "Search from the start and the goal at once and stop when the frontiers meet, cutting b^d work to about 2*b^(d/2).", {
      tier: "stretch",
      recognize: "Unweighted shortest path where the start and goal are both known and the branching factor is large, like Word Ladder or a gene mutation with a big dictionary.",
      idea: "Keep two frontier sets. Always expand the smaller one by one full level. If a generated neighbour is in the other frontier, the answer is the sum of both depths plus one. Expanding the smaller side keeps the work balanced.",
      template: `def bidirectional(start, goal, neighbors):
    if start == goal:
        return 0
    front, back = {start}, {goal}
    seen = {start, goal}
    steps = 0
    while front and back:
        if len(front) > len(back):
            front, back = back, front
        steps += 1
        nxt = set()
        for s in front:
            for t in neighbors(s):
                if t in back:
                    return steps
                if t not in seen:
                    seen.add(t)
                    nxt.add(t)
        front = nxt
    return -1`,
      pitfalls: "Expanding node by node instead of level by level, which can return a path that isn't shortest. Neighbours that aren't symmetric, so the backward search needs reversed edges.",
      staff: "Compare it with A*: bidirectional search needs no heuristic but needs a known goal and reversible moves. A* needs an admissible heuristic. Say which fits the problem.",
      problems: [
        [127, "Word Ladder", "H", "G"],
        [752, "Open the Lock", "M"],
        [433, "Minimum Genetic Mutation", "M"]
      ],
      tools: ["Breadth-First Search", "Hash Set"],
      blocks: ["Swap", "Visited Markers", "Big-O Time & Space"]
    }],
    ["DFS, Cycle Detection & Graph Cloning", "Depth-first traversal with three colours (unvisited, on the current path, done) finds directed cycles; a map from old to new nodes clones a graph.", {
      tier: "core",
      recognize: "Can every course finish (no cycle)? Which nodes are safe, i.e. never reach a cycle? Deep-copy a graph. List all paths in a DAG. Is this undirected graph a tree?",
      idea: "In a directed graph, a back edge to a node still in progress (GRAY) means a cycle. Visited-or-not is not enough, because reaching an already finished node is fine. For an undirected graph, skip the parent edge, or check that edges == n-1 and the graph is connected. For cloning, create the copy before recursing so cycles end at the map lookup.",
      template: `WHITE, GRAY, BLACK = 0, 1, 2
def has_cycle(n, adj):
    color = [WHITE] * n
    def dfs(u):
        color[u] = GRAY
        for v in adj[u]:
            if color[v] == GRAY:
                return True
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False
    return any(color[u] == WHITE and dfs(u) for u in range(n))

def clone(node, copies=None):
    copies = {} if copies is None else copies
    if node in copies:
        return copies[node]
    copies[node] = Node(node.val)
    copies[node].neighbors = [clone(nb, copies) for nb in node.neighbors]
    return copies[node]`,
      pitfalls: "Using a two-state visited set for a directed cycle check, which reports false cycles on diamond shapes. Forgetting disconnected components. Hitting Python's recursion limit on chains of about 10^5 nodes, so write it iteratively or raise the limit.",
      staff: "On a dependency graph too big for one machine, say why cycle detection is hard to distribute and offer alternatives: Kahn-style in-degree peeling in rounds, or contracting SCCs per shard first. For clone, mention keeping the old-to-new map in a shared key-value store when cloning across services.",
      problems: [
        [207, "Course Schedule", "M"],
        [133, "Clone Graph", "M"],
        [802, "Find Eventual Safe States", "M"],
        [797, "All Paths From Source to Target", "M"],
        [261, "Graph Valid Tree", "M"],
        [399, "Evaluate Division", "M"]
      ],
      tools: ["Depth-First Search", "Graph Representations", "Hash Map", "Recursion Limit & Iterative Rewrites"],
      blocks: ["Visited Markers", "Base Case", "Call Stack & Depth", "Recursion Stack Space", "Helper Functions & Closures"]
    }],
    ["Topological Sort", "Order the nodes of a DAG so every edge points forward: Kahn's algorithm repeatedly removes nodes with in-degree 0; output shorter than n means a cycle.", {
      tier: "google",
      recognize: "Prerequisites, build order, task scheduling with dependencies, recovering an alphabet from sorted words (Alien Dictionary, reported at L6), or the earliest finish time with parallel workers.",
      idea: "A node can come next once all its prerequisites are output, which is exactly when its in-degree is 0. BFS over in-degree-0 nodes gives a valid order in O(V+E). If fewer than V nodes come out, the leftovers form a cycle. For the longest path or earliest finish, run DP along the topological order.",
      template: `from collections import deque, defaultdict
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []

# Alien Dictionary: compare adjacent words, the first differing
# char gives edge a -> b; invalid if a word is followed by its own prefix.`,
      pitfalls: "Alien Dictionary: missing the invalid case where 'abc' comes before 'ab', adding the same edge twice and inflating in-degree, and leaving out letters that never appear in an edge. Using a min-heap only when the problem asks for the lexicographically smallest order.",
      staff: "Use a heap instead of a queue for a deterministic or lexicographic order, at O((V+E) log V). For earliest completion with unlimited workers, take the longest path through the DAG (Parallel Courses III). With k workers it becomes heap-based list scheduling, which is NP-hard to optimise, so say so. At scale, run Kahn in rounds: each round's in-degree-0 frontier can run in parallel.",
      problems: [
        [210, "Course Schedule II", "M"],
        [269, "Alien Dictionary", "H", "G"],
        [207, "Course Schedule", "M"],
        [310, "Minimum Height Trees", "M"],
        [2050, "Parallel Courses III", "H"],
        [1203, "Sort Items by Groups Respecting Dependencies", "H"]
      ],
      tools: ["Graph Representations", "Queue", "collections: deque, Counter, defaultdict", "Breadth-First Search", "heapq"],
      blocks: ["Precomputation", "Accumulators", "Loop Invariants", "Guard Clauses & Early Return"]
    }],
    ["Union-Find Connectivity", "A disjoint-set forest with path compression and union by rank answers 'are these connected?' as edges arrive, in near-constant amortized time.", {
      tier: "google",
      recognize: "Connectivity that grows over time (add-land operations, edges streaming in), counting components, finding the edge that creates a cycle, merging accounts that share an email, or equations like a==b and a!=c.",
      idea: "Each set is a tree with one root. find walks up to the root and compresses the path. union links the root of the smaller-rank tree under the larger. Each successful union reduces the component count by one, and a failed union means the edge closes a cycle. Cost is O(alpha(n)) per operation, effectively constant.",
      template: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True`,
      pitfalls: "Comparing parent[a] == parent[b] instead of find(a) == find(b). Number of Islands II: adding the same cell twice and counting it twice. Mapping 2D cells to ids with r*C+c and getting C wrong. Using DSU when edges also get deleted, which it can't handle; process deletions offline in reverse, or use a different structure.",
      staff: "Islands over a stream of add-land operations is the textbook DSU follow-up to Number of Islands: O(k * alpha) total versus a re-flood after every op. For a grid too big for memory, sweep row by row with a DSU over two rows. For a graph across machines, build a local DSU per shard, then merge the roots of cut edges at a coordinator, or run iterative label propagation of the minimum component id, as in MapReduce connected components.",
      problems: [
        [323, "Number of Connected Components in an Undirected Graph", "M"],
        [305, "Number of Islands II", "H", "G"],
        [261, "Graph Valid Tree", "M"],
        [684, "Redundant Connection", "M"],
        [721, "Accounts Merge", "M"],
        [947, "Most Stones Removed with Same Row or Column", "M"],
        [990, "Satisfiability of Equality Equations", "M"]
      ],
      tools: ["Union-Find", "Array & Dynamic Array", "Hash Map"],
      blocks: ["Amortized Analysis", "Swap", "Reduction / Transform", "Accumulators"]
    }],
    ["Dijkstra Shortest Path", "With non-negative weights, always settle the closest unsettled node next using a min-heap; skip stale heap entries.", {
      tier: "google",
      recognize: "Weighted shortest path or minimum cost with non-negative weights: network delay, the path that minimises the maximum edge (effort, water level), the best probability path (maximise a product), or counting the number of shortest paths.",
      idea: "Once a node is popped with the smallest distance, no later path can beat it, because every edge is >= 0. Lazy deletion: push (dist, node) on each improvement and skip popped entries whose dist is stale. O((V+E) log V). Minimax variants replace + with max; probability variants use a max-heap over the product.",
      template: `import heapq
def dijkstra(n, adj, src):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
      pitfalls: "Leaving out the stale-entry skip, which still works but blows up the run time. Using it with negative edges. Marking nodes visited when pushed instead of when popped. Getting the heap tuple order wrong so it compares nodes first.",
      staff: "Dijkstra with extra state: when the cost depends on more than the node (stops used, fuel, time, keys), the heap key stays the cost but the node becomes (node, extra), and the dist table gets that extra dimension. Mention A* for a point-to-point query with a heuristic. Mention bidirectional Dijkstra and contraction hierarchies or precomputed landmarks for road-network scale. Note that a distributed SSSP runs Bellman-Ford-like rounds because the global heap order can't be shared cheaply.",
      problems: [
        [743, "Network Delay Time", "M"],
        [1631, "Path With Minimum Effort", "M"],
        [778, "Swim in Rising Water", "H"],
        [1514, "Path with Maximum Probability", "M"],
        [505, "The Maze II", "M"],
        [1976, "Number of Ways to Arrive at Destination", "M"]
      ],
      tools: ["Binary Heap", "heapq", "Graph Representations"],
      blocks: ["Greedy Choice", "Tuple Comparison", "Sentinels", "Loop Invariants"]
    }],
    ["K-Constrained Shortest Path (Bellman-Ford)", "When a path may use at most K edges, or weights can be negative, relax every edge in rounds; round i finalises paths of up to i edges.", {
      tier: "google",
      recognize: "Cheapest flight with at most K stops, a minimum cost path within a time budget, or negative edges with a need to detect negative cycles.",
      idea: "Bellman-Ford: dist after i rounds is the best cost using at most i edges. For a K-stop limit, run exactly K+1 rounds, and relax each round from a copy of the previous round's dist so one round can't chain several edges. Plain Dijkstra fails here because a cheaper path that uses more stops can block a feasible one. Run Dijkstra on state (node, stops) instead.",
      template: `def cheapest_within_k(n, flights, src, dst, k):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    for _ in range(k + 1):
        prev = dist[:]
        for u, v, w in flights:
            if prev[u] + w < dist[v]:
                dist[v] = prev[u] + w
        if dist == prev:
            break
    return -1 if dist[dst] == INF else dist[dst]`,
      pitfalls: "Relaxing from the array you are updating, which lets one round use several edges. Off-by-one: K stops means K+1 edges. Pruning Dijkstra with a plain visited set on node alone.",
      staff: "Compare the three: Bellman-Ford rounds O(K*E), BFS by levels with pruning, and Dijkstra over (node, stops) at O(E*K log(V*K)). Choose by K and density. Detect negative cycles with one extra round, and explain arbitrage detection as -log(rate) edges.",
      problems: [
        [787, "Cheapest Flights Within K Stops", "M"],
        [1928, "Minimum Cost to Reach Destination in Time", "H"],
        [743, "Network Delay Time", "M"]
      ],
      tools: ["Graph Representations", "Array & Dynamic Array", "heapq"],
      blocks: ["Loop Invariants", "Reference vs Copy", "Off-by-One Errors", "Dynamic Programming"]
    }],
    ["Minimum Spanning Tree (Kruskal & Prim)", "Connect all nodes at minimum total cost: Kruskal sorts edges and unions; Prim grows from a node with a heap.", {
      tier: "stretch",
      recognize: "Connect all points, cities or houses at minimum total cost. Also used to find which edges are critical to the MST.",
      idea: "Cut property: the cheapest edge crossing any cut belongs to some MST. Kruskal sorts edges and adds each one that joins two components, using DSU, at O(E log E). Prim pushes the edges of the growing tree into a heap and takes the cheapest edge to a new node. For a dense complete graph, such as all pairs of points, use O(V^2) Prim with an array.",
      template: `def kruskal(n, edges):
    edges.sort(key=lambda e: e[2])
    dsu = DSU(n)
    total = used = 0
    for u, v, w in edges:
        if dsu.union(u, v):
            total += w
            used += 1
            if used == n - 1:
                break
    return total if used == n - 1 else -1

# Optional virtual node trick: 'build a well' = edge from node 0 with the well cost.`,
      pitfalls: "Forgetting to check that the graph is connected (used < n-1). Building all O(n^2) edges for points when array-based Prim avoids the sort. Confusing an MST with shortest paths, which are different trees.",
      staff: "Apply the exchange argument to justify the greedy choice out loud. A virtual super-node turns per-node costs into edges (Optimize Water Distribution). For a huge graph, mention Boruvka's algorithm, which is parallel-friendly and works in rounds where each component picks its cheapest outgoing edge.",
      problems: [
        [1584, "Min Cost to Connect All Points", "M"],
        [1135, "Connecting Cities With Minimum Cost", "M"],
        [1168, "Optimize Water Distribution in a Village", "H"],
        [1489, "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree", "H"]
      ],
      tools: ["Union-Find", "Comparison Sort & Comparators", "Binary Heap", "heapq"],
      blocks: ["Greedy Choice", "Exchange Argument", "Reduction / Transform"]
    }],
    ["Bipartite Check & Graph Coloring", "Two-colour the graph with BFS or DFS; a conflict on any edge means an odd cycle, so it isn't bipartite.", {
      tier: "core",
      recognize: "Split people or nodes into two groups so no edge stays inside a group: dislikes, possible bipartition, or 'is the graph bipartite'.",
      idea: "Colour the start node 0 and each neighbour the opposite colour. If an edge joins two nodes of the same colour, there is an odd cycle. Run it from every uncoloured node to cover disconnected graphs. O(V+E). DSU is an alternative: union each node's neighbours together, then check the node isn't in its neighbours' set.",
      template: `from collections import deque
def is_bipartite(n, adj):
    color = [-1] * n
    for s in range(n):
        if color[s] != -1:
            continue
        color[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`,
      pitfalls: "Only starting from node 0 in a disconnected graph. Building the adjacency for 1-indexed input in a 0-indexed array.",
      staff: "General k-colouring is NP-hard, which is why the problem must be 2-colouring. Greedy colouring works when the degree is bounded (Flower Planting, degree <= 3 with 4 colours). Link bipartite structure to matching, such as assigning tasks to workers, and name Hopcroft-Karp without implementing it.",
      problems: [
        [785, "Is Graph Bipartite?", "M"],
        [886, "Possible Bipartition", "M"],
        [1042, "Flower Planting With No Adjacent", "M"]
      ],
      tools: ["Breadth-First Search", "Graph Representations", "Union-Find"],
      blocks: ["Visited Markers", "Boolean Flags", "Guard Clauses & Early Return"]
    }],
    ["Bridges & Articulation Points (Tarjan)", "One DFS with discovery times and low-links finds the edges and nodes whose removal disconnects the graph.", {
      tier: "stretch",
      recognize: "Critical connections in a network, single points of failure, or the minimum number of removals to disconnect a structure.",
      idea: "low[u] is the earliest discovery time reachable from u's subtree using one back edge. Tree edge (u, v) is a bridge if low[v] > disc[u]. A non-root node u is an articulation point if some child has low[v] >= disc[u]. The root is one if it has 2 or more DFS children. O(V+E).",
      template: `def bridges(n, adj):
    disc = [-1] * n
    low = [0] * n
    out = []
    timer = [0]
    def dfs(u, parent):
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        for v in adj[u]:
            if v == parent:
                continue
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    out.append((u, v))
            else:
                low[u] = min(low[u], disc[v])
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    return out`,
      pitfalls: "Skipping by parent node instead of parent edge when the graph has parallel edges. Recursion depth on 10^5 nodes. Mixing up > (bridge) and >= (articulation point).",
      staff: "Explain it as a reliability question: bridges are single links whose failure partitions the network. The fix is to add redundancy so the graph becomes 2-edge-connected. For the island version (LeetCode 1568), observe the answer is always 0, 1 or 2 before reaching for Tarjan.",
      problems: [
        [1192, "Critical Connections in a Network", "H"],
        [1568, "Minimum Number of Days to Disconnect Island", "H"]
      ],
      tools: ["Depth-First Search", "Graph Representations", "Recursion Limit & Iterative Rewrites"],
      blocks: ["Call Stack & Depth", "Helper Functions & Closures", "Running Best-So-Far"]
    }],
    ["Eulerian Path (Hierholzer)", "Use every edge exactly once: start at the right node, walk edges greedily, and add nodes to the route post-order.", {
      tier: "stretch",
      recognize: "Reconstruct an itinerary from tickets, arrange pairs end to end, or build a De Bruijn sequence that contains every password (Cracking the Safe).",
      idea: "A directed Euler path exists if at most one node has out-in = 1 (the start) and one has in-out = 1 (the end), and the edges are connected. Hierholzer's DFS consumes edges and appends a node only when it is stuck, then reverses the list. O(E), or O(E log E) when it needs lexical order.",
      template: `from collections import defaultdict
def itinerary(tickets):
    adj = defaultdict(list)
    for a, b in sorted(tickets, reverse=True):
        adj[a].append(b)
    route, stack = [], ["JFK"]
    while stack:
        while adj[stack[-1]]:
            stack.append(adj[stack[-1]].pop())
        route.append(stack.pop())
    return route[::-1]`,
      pitfalls: "Greedy DFS without post-order, which gets stuck in a dead end too early. Forgetting the reverse. Choosing the wrong start when the in-degree and out-degree are unbalanced.",
      staff: "Recognising that the problem is Eulerian (using edges, not visiting nodes) is the whole trick. Contrast it with Hamiltonian path, which is NP-hard. Cracking the Safe is an Euler circuit on a De Bruijn graph of (n-1)-length prefixes.",
      problems: [
        [332, "Reconstruct Itinerary", "H"],
        [753, "Cracking the Safe", "H"],
        [2097, "Valid Arrangement of Pairs", "H"]
      ],
      tools: ["Stack", "Graph Representations", "collections: deque, Counter, defaultdict"],
      blocks: ["Recursion to Explicit Stack", "Reduction / Transform", "Reverse Scan"]
    }],
    ["Floyd-Warshall All-Pairs Paths", "Three nested loops over an intermediate node k give all-pairs shortest paths or reachability in O(n^3); only for n of a few hundred.", {
      tier: "awareness",
      recognize: "Small n (up to about 400) and many queries over all pairs: which city has the fewest neighbours within a threshold, transitive prerequisites, or ratio queries.",
      idea: "dist[i][j] after k rounds uses only intermediate nodes 0..k. Relax with dist[i][k] + dist[k][j]. The k loop must be outermost. For reachability, use boolean OR/AND instead of min/+.",
      template: `def floyd(n, edges):
    INF = float("inf")
    d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
    for u, v, w in edges:
        d[u][v] = min(d[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d`,
      pitfalls: "Putting the k loop inside the other loops. Using it when n is 10^4, where n^3 is far too slow; run Dijkstra from each source on sparse graphs instead.",
      staff: "Pick by numbers: V*Dijkstra is O(V*E log V) and Floyd is O(V^3). Floyd wins on dense small graphs. Course Schedule IV can also be solved by BFS from each node or with bitset reachability.",
      problems: [
        [1334, "Find the City With the Smallest Number of Neighbors at a Threshold Distance", "M"],
        [1462, "Course Schedule IV", "M"],
        [399, "Evaluate Division", "M"]
      ],
      tools: ["Matrix / Grid", "Graph Representations"],
      blocks: ["Nested Loops", "Dynamic Programming", "Constraints to Complexity"]
    }],
    ["Strongly Connected Components", "Kosaraju (two DFS passes, the second on the reversed graph) or Tarjan (one pass with low-links) groups nodes that reach each other.", {
      tier: "awareness",
      recognize: "Mutual reachability in a directed graph, condensing cycles into single nodes before running DAG DP, or 2-SAT.",
      idea: "Kosaraju: DFS to record finish order, then DFS the reversed graph in decreasing finish order; each tree is one SCC. Contracting SCCs leaves a DAG, so topological DP applies. O(V+E).",
      template: `def kosaraju(n, adj):
    radj = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            radj[v].append(u)
    order, seen = [], [False] * n
    def dfs1(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                dfs1(v)
        order.append(u)
    for u in range(n):
        if not seen[u]:
            dfs1(u)
    comp = [-1] * n
    def dfs2(u, c):
        comp[u] = c
        for v in radj[u]:
            if comp[v] == -1:
                dfs2(v, c)
    c = 0
    for u in reversed(order):
        if comp[u] == -1:
            dfs2(u, c)
            c += 1
    return comp`,
      pitfalls: "Running the second pass on the original graph. Recursion depth on large inputs.",
      staff: "Mention it as a preprocessing step: condense cycles into the DAG of SCCs, then run topological sort or longest-path DP. That is how cyclic dependency graphs get analysed.",
      problems: [
        [null, "Find All Strongly Connected Components of a Directed Graph", "M"],
        [2360, "Longest Cycle in a Graph", "H"]
      ],
      tools: ["Depth-First Search", "Graph Representations"],
      blocks: ["Two Pass", "Reduction / Transform", "Call Stack & Depth"]
    }]
  ]
});

PATTERNS.push({
  name: "Backtracking",
  layer: "Patterns",
  blurb: "Build candidates one choice at a time, recurse, then undo the choice; prune branches that cannot succeed.",
  items: [
    ["Backtracking: Subsets", "Each element is either in or out; one DFS that adds the current path at every node lists all 2^n subsets.", {
      tier: "core",
      recognize: "List all subsets, the power set, letter-case variants, or any problem with n <= 20 where each item is independently on or off.",
      idea: "Recursion tree: at index i, choose whether to include nums[i], or loop j from i onward and pick the next element. Every node is a valid subset. Duplicates: sort first and skip nums[j] == nums[j-1] when j > start. O(n * 2^n).",
      template: `def subsets_with_dup(nums):
    nums.sort()
    out, path = [], []
    def dfs(start):
        out.append(path[:])
        for j in range(start, len(nums)):
            if j > start and nums[j] == nums[j - 1]:
                continue
            path.append(nums[j])
            dfs(j + 1)
            path.pop()
    dfs(0)
    return out`,
      pitfalls: "Appending path instead of path[:], which leaves every saved result aliased to the same list. Skipping duplicates with j > 0 instead of j > start. Forgetting the pop.",
      staff: "Show the iterative bitmask version (for mask in range(1 << n)) as an alternative, and say when 2^n is acceptable (n <= 20). For n around 40, use meet-in-the-middle: enumerate each half's subset sums and combine them with sorting or two pointers.",
      problems: [
        [78, "Subsets", "M"],
        [90, "Subsets II", "M"],
        [784, "Letter Case Permutation", "M"],
        [1863, "Sum of All Subset XOR Totals", "E"]
      ],
      tools: ["Array & Dynamic Array", "Bitset / Bitmask", "itertools"],
      blocks: ["Backtracking", "Copying the Path in Backtracking", "Base Case", "Recursive Case", "Constraints to Complexity"]
    }],
    ["Backtracking: Permutations", "Pick any unused element for each position; a used[] array or in-place swaps tracks what remains.", {
      tier: "core",
      recognize: "Every ordering of the items, arrangements with an adjacency rule (squareful), or counting the distinct sequences you can form from tiles.",
      idea: "Depth = position. Try every unused element, mark it used, recurse, then unmark. For duplicates, sort and skip nums[i] when it equals nums[i-1] and nums[i-1] is not used, so equal values are always placed in a fixed order. O(n * n!).",
      template: `def permute_unique(nums):
    nums.sort()
    out, path = [], []
    used = [False] * len(nums)
    def dfs():
        if len(path) == len(nums):
            out.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            path.append(nums[i])
            dfs()
            path.pop()
            used[i] = False
    dfs()
    return out`,
      pitfalls: "Getting the duplicate-skip condition backwards. Using path.remove(x) to undo, which is O(n) and wrong with duplicates. Building a new list per call instead of reusing path.",
      staff: "If only the k-th permutation or the next one is needed, don't enumerate: use the factorial number system (Permutation Sequence) or the next-permutation algorithm in O(n). State n! out loud to show you know when enumeration is impossible.",
      problems: [
        [46, "Permutations", "M"],
        [47, "Permutations II", "M"],
        [996, "Number of Squareful Arrays", "H"],
        [1079, "Letter Tile Possibilities", "M"],
        [60, "Permutation Sequence", "H"]
      ],
      tools: ["Array & Dynamic Array", "Hash Set", "itertools"],
      blocks: ["Backtracking", "Boolean Flags", "Copying the Path in Backtracking", "Base Case"]
    }],
    ["Backtracking: Combinations & Combination Sum", "Choose items in non-decreasing index order so each combination appears once; prune once the remaining target goes negative.", {
      tier: "core",
      recognize: "Pick k items, or items that sum to a target, with or without reuse, with or without duplicate values. Also splitting into k equal-sum groups.",
      idea: "Pass a start index so order never repeats. If reuse is allowed, recurse with i; otherwise use i+1. Sort the candidates so you can break as soon as candidate > remaining. For duplicates, apply the i > start skip.",
      template: `def combination_sum2(cands, target):
    cands.sort()
    out, path = [], []
    def dfs(start, remain):
        if remain == 0:
            out.append(path[:])
            return
        for i in range(start, len(cands)):
            if i > start and cands[i] == cands[i - 1]:
                continue
            if cands[i] > remain:
                break
            path.append(cands[i])
            dfs(i + 1, remain - cands[i])
            path.pop()
    dfs(0, target)
    return out`,
      pitfalls: "Recursing with i + 1 when reuse is allowed (Combination Sum I needs i). Using continue instead of break after sorting, which loses the pruning. Counting orderings as different, which is Combination Sum IV and a DP problem, not backtracking.",
      staff: "Know where enumeration stops and DP takes over. If only a count or feasibility is asked, switch to a knapsack DP in O(n*target). For k-way partition, sort descending, prune buckets of the same size, or use bitmask DP over subsets.",
      problems: [
        [39, "Combination Sum", "M"],
        [40, "Combination Sum II", "M"],
        [77, "Combinations", "M"],
        [216, "Combination Sum III", "M"],
        [698, "Partition to K Equal Sum Subsets", "M"]
      ],
      tools: ["Array & Dynamic Array", "Comparison Sort & Comparators"],
      blocks: ["Backtracking", "Guard Clauses & Early Return", "Copying the Path in Backtracking", "Dynamic Programming"]
    }],
    ["Constraint Search with Pruning", "Place one piece at a time, check constraints in O(1) with sets or bitmasks, and abandon a branch the moment it breaks a rule.", {
      tier: "stretch",
      recognize: "N-Queens, Sudoku, any puzzle with placement rules, or paths that must visit every cell exactly once.",
      idea: "Most of the speed comes from O(1) validity checks and early cutoffs. For N-Queens, keep sets for columns, r-c diagonals and r+c anti-diagonals. For Sudoku, keep per-row, per-column and per-box used sets, and fill the most constrained cell first.",
      template: `def solve_n_queens(n):
    cols, d1, d2 = set(), set(), set()
    board, out = [], []
    def place(r):
        if r == n:
            out.append(["." * c + "Q" + "." * (n - c - 1) for c in board])
            return
        for c in range(n):
            if c in cols or (r - c) in d1 or (r + c) in d2:
                continue
            cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
            place(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c); board.pop()
    place(0)
    return out`,
      pitfalls: "Re-scanning the board to check validity at every step, which costs O(n) per check. Forgetting to undo every structure you changed. On Sudoku, returning after the first solution without propagating True up the recursion.",
      staff: "Talk about search-order heuristics (most constrained variable first), bitmask state for speed, and the fact that this is exponential in the worst case. For production-scale constraint problems, name a SAT or CP solver instead of hand-rolled search.",
      problems: [
        [51, "N-Queens", "H"],
        [52, "N-Queens II", "H"],
        [37, "Sudoku Solver", "H"],
        [980, "Unique Paths III", "H"]
      ],
      tools: ["Hash Set", "Bitset / Bitmask", "Matrix / Grid"],
      blocks: ["Backtracking", "Guard Clauses & Early Return", "Brute Force & Enumeration", "Boolean Flags"]
    }],
    ["Grid Word Search with Backtracking", "DFS from each cell, mark it in use on the way down and unmark on the way back; a Trie lets one pass search for many words at once.", {
      tier: "core",
      recognize: "Find a word or many words formed by adjacent cells, a maximum-value path visiting each cell at most once, or any 'no reuse in this path' grid walk.",
      idea: "Visited is per path, not global, so restore the cell after exploring. With many words, build a Trie and walk it alongside the DFS. Stop when the prefix has no child, and delete leaf nodes once their word is found so later searches skip dead branches.",
      template: `def find_words(board, words):
    root = {}
    for w in words:
        node = root
        for ch in w:
            node = node.setdefault(ch, {})
        node["$"] = w
    R, C, out = len(board), len(board[0]), []
    def dfs(r, c, parent):
        ch = board[r][c]
        node = parent.get(ch)
        if node is None:
            return
        if "$" in node:
            out.append(node.pop("$"))
        board[r][c] = "#"
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and board[nr][nc] != "#":
                dfs(nr, nc, node)
        board[r][c] = ch
        if not node:
            parent.pop(ch)
    for r in range(R):
        for c in range(C):
            dfs(r, c, root)
    return out`,
      pitfalls: "Using a global visited set that never resets. Running one DFS per word in Word Search II, which costs O(words * cells * 4^L). Adding the same word twice when it is found from two starting cells.",
      staff: "Explain the Trie pruning win and the leaf-removal trick. For a very large board, or a dictionary served from another service, batch the prefix lookups and cache which prefixes don't exist.",
      problems: [
        [79, "Word Search", "M"],
        [212, "Word Search II", "H"],
        [1219, "Path with Maximum Gold", "M"]
      ],
      tools: ["Trie", "Matrix / Grid", "Depth-First Search", "Hash Map"],
      blocks: ["Backtracking", "Direction Arrays", "Visited Markers", "Bounds Checks"]
    }],
    ["String Partitioning by Backtracking", "Choose where to cut next, check the piece is valid, and recurse on the rest of the string.", {
      tier: "core",
      recognize: "Split a string into palindromes, valid IP octets, or unique substrings, or insert operators between digits to hit a target.",
      idea: "State is the start index. Try every end index j, keep s[start:j] if it is valid, then recurse from j. Precompute a palindrome table so each check is O(1). For Expression Add Operators, carry the running value and the last operand so multiplication can undo the last addition.",
      template: `def partition(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
    out, path = [], []
    def dfs(start):
        if start == n:
            out.append(path[:])
            return
        for end in range(start, n):
            if pal[start][end]:
                path.append(s[start:end + 1])
                dfs(end + 1)
                path.pop()
    dfs(0)
    return out`,
      pitfalls: "Restore IP: allowing leading zeros like '01' or values over 255, and not stopping when more than 4 parts are left. Expression operators: numbers with leading zeros, and getting multiplication precedence wrong.",
      staff: "If only the minimum number of cuts or the count of partitions is needed, switch to DP (Palindrome Partitioning II). Say the output can be exponential in size, which sets the lower bound on enumeration.",
      problems: [
        [131, "Palindrome Partitioning", "M"],
        [93, "Restore IP Addresses", "M"],
        [282, "Expression Add Operators", "H"],
        [1593, "Split a String Into the Max Number of Unique Substrings", "M"]
      ],
      tools: ["String & String Builder", "Matrix / Grid", "Memoization"],
      blocks: ["Backtracking", "Precomputation", "Half-Open vs Closed Ranges", "Copying the Path in Backtracking"]
    }],
    ["Generating Valid Structures", "Build only valid outputs by enforcing the rule as you go, like never closing more brackets than you have opened.", {
      tier: "core",
      recognize: "Generate every valid parentheses string, phone-keypad letter combinations, Gray codes, or the fewest removals that make a string valid.",
      idea: "Encode the validity rule in the state, for example (open, close) counts with close <= open <= n, so every leaf is valid and nothing gets filtered afterwards. For Remove Invalid Parentheses, first compute how many lefts and rights to remove, then backtrack with those budgets, or BFS by number of removals.",
      template: `def generate_parenthesis(n):
    out, path = [], []
    def dfs(open_, close):
        if len(path) == 2 * n:
            out.append("".join(path))
            return
        if open_ < n:
            path.append("(")
            dfs(open_ + 1, close)
            path.pop()
        if close < open_:
            path.append(")")
            dfs(open_, close + 1)
            path.pop()
    dfs(0, 0)
    return out`,
      pitfalls: "Generating all 2^(2n) strings and filtering them. String concatenation in a loop, which is O(n^2); use a list and join. An empty input for phone letters should return [] not [''].",
      staff: "The count of valid parentheses strings is the Catalan number, so give the output-size bound. If only the count is needed, use the Catalan DP. Remove Invalid Parentheses: compare BFS by removal level, which naturally finds the minimum, with counted backtracking.",
      problems: [
        [22, "Generate Parentheses", "M"],
        [17, "Letter Combinations of a Phone Number", "M"],
        [301, "Remove Invalid Parentheses", "H"],
        [89, "Gray Code", "M"]
      ],
      tools: ["String & String Builder", "Array & Dynamic Array"],
      blocks: ["Backtracking", "Base Case", "Guard Clauses & Early Return", "Accumulators"]
    }]
  ]
});
  PATTERNS.push({
    name: "Dynamic Programming",
    layer: "Patterns",
    blurb: "Define the state, write the transition, seed the base case, then pick the evaluation order. Google over-indexes on DP compared with other companies.",
    items: [
      ["1D Linear DP", "The answer at index i depends on a fixed number of earlier answers, like the Fibonacci recurrence with a choice at each step.", {
        tier: "core",
        recognize: "Count the ways to reach the end, or find the best total along a sequence where each step makes a small local choice (take or skip, one step or two). The input is one array or string and the choice at i only looks back a constant distance.",
        idea: "State: dp[i] is the answer for the prefix ending at i (or the first i items). Transition: dp[i] = combine(dp[i-1], dp[i-2], ...), e.g. House Robber dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Base case: dp[0] and dp[1] seeded directly. Because only the last k values are read, the table collapses to k variables.",
        template: `def rob(nums):
    prev2, prev1 = 0, 0          # dp[i-2], dp[i-1]
    for x in nums:
        cur = max(prev1, prev2 + x)  # skip x, or take x
        prev2, prev1 = prev1, cur
    return prev1

def num_decodings(s):
    prev2, prev1 = 1, 0 if s[0] == '0' else 1   # dp[-1], dp[0]
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        if 10 <= int(s[i-1:i+1]) <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1`,
        pitfalls: "Seeding the base case wrong, e.g. dp[0] = 1 for 'one way to decode nothing' vs 0. Forgetting '0' cannot start a code in Decode Ways. For the circular House Robber II, run the linear version twice (drop the first house, then drop the last) and handle n == 1.",
        staff: "Show the O(n) table first, then roll it to O(1) variables and say why that's safe (only dp[i-1] and dp[i-2] are read). Be ready to reconstruct which houses were robbed: keep the full table and walk back from the end. If n is huge and the recurrence is linear (Climbing Stairs), mention matrix exponentiation for O(log n).",
        problems: [
          [70, "Climbing Stairs", "E"],
          [746, "Min Cost Climbing Stairs", "E"],
          [198, "House Robber", "M"],
          [213, "House Robber II", "M"],
          [91, "Decode Ways", "M"],
          [740, "Delete and Earn", "M"]
        ],
        tools: ["Array & Dynamic Array", "Memoization"],
        blocks: ["Dynamic Programming", "Base Case", "Recurrences & Master Theorem", "Space-Time Trade-off", "Single Pass"]
      }],
      ["State Machine DP", "Track a few named states per index (holding, sold, cooling down) and move between them with explicit transitions.", {
        tier: "google",
        recognize: "Each step you are in one of a small number of modes, and the rules restrict which mode can follow which: buy/sell with cooldown or fees, at most k transactions, 'one deletion allowed', or 'have used the power-up or not'.",
        idea: "State: dp[i][s] is the best value after processing i items while in state s. Transition: one line per arrow in the state diagram, e.g. hold = max(hold, cash - price), cash = max(cash, hold + price - fee). Base case: before any item, cash = 0 and hold = -infinity (you can't be holding yet). Draw the diagram first; the code is the diagram.",
        template: `def max_profit_cooldown(prices):
    hold, sold, rest = float('-inf'), 0, 0
    for p in prices:
        prev_sold = sold
        sold = hold + p               # sell today
        hold = max(hold, rest - p)    # keep holding, or buy after resting
        rest = max(rest, prev_sold)   # cooldown or keep resting
    return max(sold, rest)

def max_profit_k(k, prices):
    buy = [float('-inf')] * (k + 1)
    sell = [0] * (k + 1)
    for p in prices:
        for t in range(1, k + 1):
            buy[t] = max(buy[t], sell[t-1] - p)
            sell[t] = max(sell[t], buy[t] + p)
    return sell[k]`,
        pitfalls: "Updating states in place so a value computed this step is read again in the same step (buying and selling on the same day). Save the previous values or update in a safe order. Initialising 'holding' to 0 instead of minus infinity.",
        staff: "Name the states and draw the transitions before coding; it makes the solution easy to verify out loud. Point out that every stock variant is the same machine with different edges. For k transactions with k >= n/2, collapse to the unlimited-transactions greedy. Reconstruct the trades by storing which transition won at each step.",
        problems: [
          [309, "Best Time to Buy and Sell Stock with Cooldown", "M"],
          [714, "Best Time to Buy and Sell Stock with Transaction Fee", "M"],
          [123, "Best Time to Buy and Sell Stock III", "H"],
          [188, "Best Time to Buy and Sell Stock IV", "H"],
          [1186, "Maximum Subarray Sum with One Deletion", "M"]
        ],
        tools: ["Array & Dynamic Array"],
        blocks: ["Dynamic Programming", "Sentinels", "Running Best-So-Far", "Single Pass", "Base Case"]
      }],
      ["Grid DP", "dp[r][c] is built from the cell above and the cell to the left (or other fixed neighbours), filled row by row.", {
        tier: "core",
        recognize: "Move through a 2D grid only right/down (or another acyclic direction set) and count paths, or minimise/maximise a path cost. Also squares or rectangles of 1s anchored at a corner.",
        idea: "State: dp[r][c] is the answer for the subgrid ending at (r, c). Transition: dp[r][c] = f(dp[r-1][c], dp[r][c-1]) + cost, e.g. Unique Paths sums them and Minimum Path Sum takes the min. Maximal Square uses 1 + min(up, left, diagonal). Base case: the first row and column, or a padded row/column of sentinels. Dungeon Game runs backwards from the bottom-right because the constraint is about what you need on arrival.",
        template: `def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * (n + 1)   # one rolling row, padded
    dp[1] = 0
    for r in range(m):
        for c in range(n):
            dp[c+1] = grid[r][c] + min(dp[c+1], dp[c])  # from above, from left
    return dp[n]

def maximal_square(matrix):
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    best = 0
    for r in range(1, m + 1):
        for c in range(1, n + 1):
            if matrix[r-1][c-1] == '1':
                dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])
                best = max(best, dp[r][c])
    return best * best`,
        pitfalls: "Building the 2D table with [[0]*n]*m, which aliases every row. Forgetting obstacles reset a cell to 0 paths (Unique Paths II). Seeding the padded row so the first real cell isn't polluted by infinity plus a cost.",
        staff: "Roll the table to one row (O(n) space) and explain why the left neighbour is already updated and the up neighbour is not. If the grid is too large for memory, process it as a stream of rows: you only ever need the previous row. Reconstruct the path by walking back from the target, choosing the neighbour that produced the value.",
        problems: [
          [62, "Unique Paths", "M"],
          [63, "Unique Paths II", "M"],
          [64, "Minimum Path Sum", "M"],
          [931, "Minimum Falling Path Sum", "M"],
          [221, "Maximal Square", "M"],
          [174, "Dungeon Game", "H"]
        ],
        tools: ["Matrix / Grid", "Array & Dynamic Array"],
        blocks: ["Dynamic Programming", "Nested Loops", "Sentinels", "Aliasing", "Base Case", "Reverse Scan"]
      }],
      ["Two-Sequence DP", "dp[i][j] compares prefixes of two strings; each cell looks at the diagonal, up and left.", {
        tier: "google",
        recognize: "Two strings (or arrays) and a question about aligning them: longest common subsequence, edit distance, interleaving, count distinct subsequences, or matching a pattern with '.', '?' and '*'.",
        idea: "State: dp[i][j] is the answer for a[:i] and b[:j]. Transition: if a[i-1] == b[j-1], take the diagonal (dp[i-1][j-1] plus a match); otherwise combine the 'drop from a' (dp[i-1][j]) and 'drop from b' (dp[i][j-1]) options, plus replace (diagonal + 1) for edit distance. Base case: row 0 and column 0 describe an empty prefix, e.g. edit distance dp[i][0] = i.",
        template: `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],     # delete
                                   dp[i][j-1],     # insert
                                   dp[i-1][j-1])   # replace
    return dp[m][n]`,
        pitfalls: "Off-by-one between dp indices (prefix length) and string indices (i-1). For '*' in regex matching, '*' applies to the previous character and can match zero copies (dp[i][j-2]). For Wildcard Matching, '*' matches any run. Forgetting to initialise the first row for patterns like 'a*b*' that match the empty string.",
        staff: "Roll to two rows, or one row plus a saved diagonal, for O(min(m, n)) space. Reconstruct the actual LCS or edit script by backtracking from dp[m][n]. Note that reconstruction needs the full table; Hirschberg's divide-and-conquer recovers it in linear space. For very long near-identical strings (diffs), mention banded DP or Myers' O(ND) diff.",
        problems: [
          [1143, "Longest Common Subsequence", "M"],
          [583, "Delete Operation for Two Strings", "M"],
          [72, "Edit Distance", "M"],
          [97, "Interleaving String", "M"],
          [115, "Distinct Subsequences", "H"],
          [10, "Regular Expression Matching", "H"],
          [44, "Wildcard Matching", "H"]
        ],
        tools: ["Matrix / Grid", "String & String Builder"],
        blocks: ["Dynamic Programming", "Nested Loops", "Off-by-One Errors", "Base Case", "Half-Open vs Closed Ranges"]
      }],
      ["0/1 Knapsack", "Each item is used at most once; dp over capacity, iterated backwards so an item isn't reused.", {
        tier: "core",
        recognize: "Pick a subset of items, each at most once, to hit or stay under a target sum or capacity: partition into equal halves, assign + or - signs to reach a target, fit items under two budgets.",
        idea: "State: dp[c] is whether (or how many ways, or the best value with which) capacity c can be reached using the items seen so far. Transition: for each item w, for c from capacity down to w: dp[c] = combine(dp[c], dp[c - w]). Base case: dp[0] = True (or 1 way, or value 0). Iterating c downwards is what enforces 'each item once'.",
        template: `def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for w in nums:
        for c in range(target, w - 1, -1):   # backwards: use w at most once
            dp[c] = dp[c] or dp[c - w]
    return dp[target]

def find_target_sum_ways(nums, target):
    total = sum(nums)
    if (total + target) % 2 or abs(target) > total:
        return 0
    p = (total + target) // 2    # sum of the '+' subset
    dp = [0] * (p + 1)
    dp[0] = 1
    for w in nums:
        for c in range(p, w - 1, -1):
            dp[c] += dp[c - w]
    return dp[p]`,
        pitfalls: "Looping capacity upwards, which silently turns it into unbounded knapsack. Forgetting the parity and range checks in Target Sum. Zeros in the input double the count of ways; the 1D loop handles them only if the inner loop includes c == w.",
        staff: "Explain the reduction step (Target Sum to subset sum with p = (total + target) / 2); interviewers value the transform more than the table. Note the complexity is pseudo-polynomial, O(n * capacity): if capacity is 10^9, switch to meet-in-the-middle or a bitset shift (dp |= dp << w). To list the chosen items, keep the 2D table and walk back.",
        problems: [
          [416, "Partition Equal Subset Sum", "M"],
          [494, "Target Sum", "M"],
          [1049, "Last Stone Weight II", "M"],
          [474, "Ones and Zeroes", "M"]
        ],
        tools: ["Array & Dynamic Array", "Bitset / Bitmask"],
        blocks: ["Dynamic Programming", "Reverse Scan", "Reduction / Transform", "Constraints to Complexity", "Base Case"]
      }],
      ["Unbounded Knapsack", "Items can be reused; iterate capacity upwards. Loop order decides whether you count combinations or permutations.", {
        tier: "core",
        recognize: "Unlimited copies of each coin or piece: fewest coins to make an amount, number of ways to make change, number of ordered sequences that sum to a target, fewest perfect squares.",
        idea: "State: dp[a] is the best answer (or count) for amount a. Transition: dp[a] = combine over items w of dp[a - w], e.g. Coin Change dp[a] = min(dp[a - c] + 1). Base case: dp[0] = 0 coins, or 1 way. Coins in the outer loop counts combinations (Coin Change II); amount in the outer loop counts ordered sequences (Combination Sum IV).",
        template: `def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1

def change(amount, coins):            # combinations: coins outer
    dp = [1] + [0] * amount
    for c in coins:
        for a in range(c, amount + 1):  # upwards: reuse allowed
            dp[a] += dp[a - c]
    return dp[amount]

def combination_sum4(nums, target):   # permutations: amount outer
    dp = [1] + [0] * target
    for a in range(1, target + 1):
        for x in nums:
            if x <= a:
                dp[a] += dp[a - x]
    return dp[target]`,
        pitfalls: "Swapping the loop order and counting permutations when the question wants combinations, or the reverse. Using float('inf') then returning it instead of -1. Greedy coin picking, which fails for coins like [1, 3, 4] and amount 6.",
        staff: "Explain why the loop order changes the meaning: with coins outer, each combination is built in one fixed coin order. Show a counterexample to greedy. Reconstruct the coins by storing the last coin used per amount. For a very large amount with small coins, BFS over amounts finds the fewest coins and stops early.",
        problems: [
          [322, "Coin Change", "M"],
          [518, "Coin Change II", "M"],
          [377, "Combination Sum IV", "M"],
          [279, "Perfect Squares", "M"]
        ],
        tools: ["Array & Dynamic Array", "Breadth-First Search"],
        blocks: ["Dynamic Programming", "Nested Loops", "Sentinels", "Base Case", "Brute Force & Enumeration"]
      }],
      ["LIS & Patience Sorting", "Longest increasing subsequence in O(n log n) by keeping the smallest possible tail for each length.", {
        tier: "google",
        recognize: "Longest chain where each element must be bigger than the last: increasing subsequences, nesting envelopes or boxes, divisible chains, mountain arrays (LIS from both sides).",
        idea: "O(n^2) DP: dp[i] is the LIS length ending at i; dp[i] = 1 + max(dp[j]) over j < i with a[j] < a[i]; base case dp[i] = 1. O(n log n): tails[k] is the smallest tail of any increasing subsequence of length k+1. For each x, binary-search the first tail >= x and replace it (or append). tails stays sorted, so the binary search is valid.",
        template: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)     # strictly increasing: bisect_left
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

def max_envelopes(envelopes):
    # sort width asc, height desc so equal widths can't chain
    envelopes.sort(key=lambda e: (e[0], -e[1]))
    return length_of_lis([h for _, h in envelopes])`,
        pitfalls: "tails is not an actual subsequence, only lengths are correct. Using bisect_right when the sequence must be strictly increasing (or bisect_left when non-decreasing is allowed). For Russian Doll Envelopes, sorting heights ascending within equal widths lets equal widths chain.",
        staff: "Start with the O(n^2) DP and its state, then justify the tails invariant (it stays sorted). To reconstruct the sequence, store for each element the index of its predecessor and the index sitting in each tails slot. Counting the number of LIS (673) needs the O(n^2) DP or a Fenwick tree over compressed values.",
        problems: [
          [300, "Longest Increasing Subsequence", "M"],
          [673, "Number of Longest Increasing Subsequence", "M"],
          [368, "Largest Divisible Subset", "M"],
          [1671, "Minimum Number of Removals to Make Mountain Array", "H"],
          [354, "Russian Doll Envelopes", "H"]
        ],
        tools: ["Binary Search", "bisect module", "Comparison Sort & Comparators"],
        blocks: ["Dynamic Programming", "Loop Invariants", "Monotonicity", "Tie-Breaking", "Pair Loops (i < j)"]
      }],
      ["Palindromic DP", "dp over substring ranges [i, j], filled by increasing length, for palindrome subsequences and cuts.", {
        tier: "core",
        recognize: "Longest palindromic subsequence, fewest insertions to make a palindrome, minimum cuts so every piece is a palindrome, or counting palindromic subsequences.",
        idea: "State: dp[i][j] is the answer for s[i..j]. Transition: if s[i] == s[j], dp[i][j] = dp[i+1][j-1] + 2; else max(dp[i+1][j], dp[i][j-1]). Base case: dp[i][i] = 1. Fill i from n-1 down to 0 so dp[i+1][*] is ready. Minimum cuts uses a 1D dp over prefixes plus a precomputed isPal table.",
        template: `def longest_palindrome_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]

def min_cut(s):
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    cuts = [0] * n
    for j in range(n):
        cuts[j] = j
        for i in range(j + 1):
            if s[i] == s[j] and (j - i < 2 or is_pal[i+1][j-1]):
                is_pal[i][j] = True
                cuts[j] = 0 if i == 0 else min(cuts[j], cuts[i-1] + 1)
    return cuts[n-1]`,
        pitfalls: "Filling in the wrong order so dp[i+1][j-1] isn't computed yet. Confusing subsequence (can skip characters) with substring (contiguous; use expand-around-center). Minimum insertions to make a palindrome = n - LPS, a reduction worth stating.",
        staff: "Mention the reductions: LPS(s) = LCS(s, reversed s), and minimum insertions = n - LPS. Space can drop to O(n) with one row because each row reads only the next row. Reconstruct the palindrome by walking the table from dp[0][n-1].",
        problems: [
          [516, "Longest Palindromic Subsequence", "M"],
          [1312, "Minimum Insertion Steps to Make a String Palindrome", "H"],
          [132, "Palindrome Partitioning II", "H"],
          [730, "Count Different Palindromic Subsequences", "H"]
        ],
        tools: ["Matrix / Grid", "String & String Builder"],
        blocks: ["Dynamic Programming", "Reverse Scan", "Precomputation", "Reduction / Transform", "Base Case"]
      }],
      ["Word Break & Partition DP", "dp[i] says whether (or how) the prefix s[:i] can be split into valid pieces.", {
        tier: "google",
        recognize: "Split a string into dictionary words, count or list the segmentations, find the fewest leftover characters, or find words built from other words. Reported in Google loops.",
        idea: "State: dp[i] is True if s[:i] can be segmented. Transition: dp[i] = any(dp[j] and s[j:i] in words) for j < i, limiting j to i - maxWordLen. Base case: dp[0] = True (empty prefix). Listing all segmentations (Word Break II) is DFS with memo on the start index, because the output itself can be exponential.",
        template: `def word_break(s, word_dict):
    words = set(word_dict)
    max_len = max(map(len, words), default=0)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]

from functools import cache
def word_break_all(s, word_dict):
    words = set(word_dict)
    @cache
    def go(i):
        if i == len(s):
            return [[]]
        out = []
        for j in range(i + 1, len(s) + 1):
            if s[i:j] in words:
                for rest in go(j):
                    out.append([s[i:j]] + rest)
        return out
    return [' '.join(p) for p in go(0)]`,
        pitfalls: "Slicing s[j:i] costs O(length), so the loop is O(n^2 * L) unless you cap j by the longest word or walk a trie. Word Break II without memoisation times out; with memoisation it can still blow up in memory on adversarial input like 'aaaa...b'.",
        staff: "Walking a trie from each start index avoids slicing and finds every matching word in one pass. For a huge dictionary that won't fit in memory, use a trie on disk or a Bloom filter as a pre-check. Reconstruct one segmentation by storing the j that set dp[i] = True.",
        problems: [
          [139, "Word Break", "M", "G"],
          [140, "Word Break II", "H"],
          [2707, "Extra Characters in a String", "M"],
          [472, "Concatenated Words", "H"]
        ],
        tools: ["Hash Set", "Trie", "functools.cache", "Memoization"],
        blocks: ["Dynamic Programming", "Base Case", "Precomputation", "Nested Loops", "Big-O Time & Space"]
      }],
      ["Interval DP", "dp[i][j] over a range, choosing the split point k (or the last action) inside it; filled by increasing length.", {
        tier: "stretch",
        recognize: "Merge, burst, cut or triangulate a sequence where the cost of an action depends on its neighbours at that time. Small n (often 300 or fewer) hints at O(n^3).",
        idea: "State: dp[i][j] is the best cost for the range i..j. Transition: dp[i][j] = best over k in (i, j) of dp[i][k] + dp[k][j] + cost(i, k, j). The trick is choosing k as the LAST action in the range, so its neighbours are the fixed boundaries i and j. Base case: empty or single-element ranges cost 0. Fill by increasing range length.",
        template: `def max_coins(nums):
    a = [1] + nums + [1]          # sentinel balloons at both ends
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):    # gap between i and j
        for i in range(0, n - length):
            j = i + length
            for k in range(i + 1, j):     # k is the last balloon burst in (i, j)
                dp[i][j] = max(dp[i][j],
                               dp[i][k] + a[i] * a[k] * a[j] + dp[k][j])
    return dp[0][n-1]`,
        pitfalls: "Thinking of k as the first action, which makes the neighbours unknown. Filling by i, j order instead of by length, so subranges aren't ready. Forgetting the sentinels at the ends (Burst Balloons) or the sort of cut positions (Minimum Cost to Cut a Stick).",
        staff: "Say why 'last action' makes the subproblems independent; that's the insight interviewers look for. State the O(n^3) cost and link it to the constraint. Mention Knuth's optimisation (monotone split points) to get O(n^2) for some cost functions. Reconstruct by storing the best k per range.",
        problems: [
          [312, "Burst Balloons", "H"],
          [1547, "Minimum Cost to Cut a Stick", "H"],
          [1039, "Minimum Score Triangulation of Polygon", "M"],
          [375, "Guess Number Higher or Lower II", "M"],
          [664, "Strange Printer", "H"]
        ],
        tools: ["Matrix / Grid"],
        blocks: ["Dynamic Programming", "Sentinels", "Divide & Conquer", "Constraints to Complexity", "Nested Loops"]
      }],
      ["Tree DP", "Each node returns a small tuple of answers for its subtree (e.g. robbed / not robbed), combined in post-order.", {
        tier: "google",
        recognize: "An optimisation over a tree where a node's choice constrains its children: no two adjacent nodes picked, cover every node with cameras, longest path with constraints between neighbours.",
        idea: "State: for each node, a tuple of answers keyed by the node's own status, e.g. (best if node is taken, best if not taken). Transition: in post-order, combine the children's tuples, e.g. take = val + notTake(left) + notTake(right); skip = max(left) + max(right). Base case: a null child returns the neutral tuple (0, 0). Answer: best of the root's tuple.",
        template: `def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)                 # (take, skip)
        lt, ls = dfs(node.left)
        rt, rs = dfs(node.right)
        take = node.val + ls + rs         # children must be skipped
        skip = max(lt, ls) + max(rt, rs)  # children are free
        return (take, skip)
    return max(dfs(root))

def min_camera_cover(root):
    # 0 = not covered, 1 = covered without camera, 2 = has camera
    count = 0
    def dfs(node):
        nonlocal count
        if not node:
            return 1
        l, r = dfs(node.left), dfs(node.right)
        if l == 0 or r == 0:
            count += 1
            return 2
        return 1 if (l == 2 or r == 2) else 0
    return count + (dfs(root) == 0)`,
        pitfalls: "Memoising on node identity when returning a tuple already removes the repeated work. Recursion depth on a skewed tree of 10^5 nodes overflows Python's stack. Forgetting the root's own state after the DFS (Binary Tree Cameras).",
        staff: "Explain that returning a tuple per node turns an exponential search into O(n). For deep or huge trees, convert to an iterative post-order with an explicit stack. For a general tree (n-ary, from an edge list), the same DP works after rooting it; rerooting gives the answer for every root in O(n).",
        problems: [
          [337, "House Robber III", "M"],
          [1372, "Longest ZigZag Path in a Binary Tree", "M"],
          [968, "Binary Tree Cameras", "H"],
          [2246, "Longest Path With Different Adjacent Characters", "H"]
        ],
        tools: ["Binary Tree", "Depth-First Search", "Recursion Limit & Iterative Rewrites"],
        blocks: ["Dynamic Programming", "Return Value vs Accumulator Parameter", "Recursive Case", "Base Case", "Recursion Stack Space"]
      }],
      ["DP + Binary Search: Weighted Job Scheduling", "Sort jobs by end time; dp[i] = max(skip job i, take it + best among jobs ending before it starts), found by binary search.", {
        tier: "google",
        recognize: "Choose non-overlapping intervals (jobs, rides, events, rentals) to maximise total profit, where intervals have different weights so greedy-by-end-time no longer works.",
        idea: "State: dp[i] is the best profit using the first i jobs sorted by end time. Transition: dp[i] = max(dp[i-1], profit[i] + dp[p]), where p is the number of jobs ending at or before job i's start, found with bisect on the end times. Base case: dp[0] = 0. Sorting by end makes 'compatible earlier jobs' a prefix, which is what makes binary search valid.",
        template: `from bisect import bisect_right

def job_scheduling(start, end, profit):
    jobs = sorted(zip(end, start, profit))   # by end time
    ends = [e for e, _, _ in jobs]
    dp = [0] * (len(jobs) + 1)
    for i, (e, s, p) in enumerate(jobs, 1):
        k = bisect_right(ends, s, 0, i - 1)  # jobs ending <= s
        dp[i] = max(dp[i-1], dp[k] + p)
    return dp[-1]`,
        pitfalls: "bisect_left vs bisect_right decides whether a job ending exactly at the start time counts as compatible; read the problem. Sorting by start time and then searching end times, which aren't sorted. Using unweighted greedy (earliest end) when weights differ.",
        staff: "Explain why greedy fails once weights differ, then show the O(n log n) DP. For 'at most k events' (1751), add a dimension: dp[i][k]. For a stream of new jobs, keep an ordered map from end time to best profit so far. Reconstruct the chosen jobs by recording whether take or skip won at each i.",
        problems: [
          [1235, "Maximum Profit in Job Scheduling", "H"],
          [2008, "Maximum Earnings From Taxi", "M"],
          [1751, "Maximum Number of Events That Can Be Attended II", "H"],
          [null, "Car Rental Optimization", "H", "G"]
        ],
        tools: ["Binary Search", "bisect module", "Comparison Sort & Comparators", "Ordered Map / Sorted List"],
        blocks: ["Dynamic Programming", "Monotonicity", "Half-Open vs Closed Ranges", "Precomputation", "Greedy Choice"]
      }],
      ["Bitmask DP", "Encode which of up to ~20 items are used as the bits of an integer, and DP over those 2^n subsets.", {
        tier: "stretch",
        recognize: "n is small (about 20 or less) and the state must remember exactly which items have been used: visit every node, assign tasks to workers, split into k equal groups, cover all required skills.",
        idea: "State: dp[mask] (often dp[mask][last]) is the best answer having used exactly the items in mask, ending at last. Transition: for each unused item j, dp[mask | 1 << j][j] = best(dp[mask][last] + cost(last, j)). Base case: dp[1 << start][start] = 0. Iterate masks in increasing order since adding a bit makes the number larger. Cost O(2^n * n^2).",
        template: `def shortest_path_length(graph):
    from collections import deque
    n = len(graph)
    full = (1 << n) - 1
    q = deque((i, 1 << i, 0) for i in range(n))  # node, visited mask, dist
    seen = {(i, 1 << i) for i in range(n)}
    while q:
        node, mask, d = q.popleft()
        if mask == full:
            return d
        for nb in graph[node]:
            nm = mask | (1 << nb)
            if (nb, nm) not in seen:
                seen.add((nb, nm))
                q.append((nb, nm, d + 1))

def can_partition_k_subsets(nums, k):
    total = sum(nums)
    if total % k:
        return False
    side, n = total // k, len(nums)
    dp = [-1] * (1 << n)   # fill level of current bucket, -1 = unreachable
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] < 0:
            continue
        for j in range(n):
            if not mask & (1 << j) and dp[mask] + nums[j] <= side:
                dp[mask | (1 << j)] = (dp[mask] + nums[j]) % side
    return dp[-1] == 0`,
        pitfalls: "Using it when n is 40 (2^40 is too big; consider meet-in-the-middle). Operator precedence: in Python, mask & 1 << j is mask & (1 << j), but write the parentheses anyway. Forgetting the 'last' dimension when the cost depends on order.",
        staff: "Tie it to the constraint out loud: 'n is 16, so 2^16 * 16 states is fine.' Mention the TSP connection and that the problem is NP-hard in general, which is why exponential is acceptable. Reconstruct the order by storing the predecessor for each (mask, last).",
        problems: [
          [526, "Beautiful Arrangement", "M"],
          [698, "Partition to K Equal Sum Subsets", "M"],
          [1986, "Minimum Number of Work Sessions to Finish the Tasks", "M"],
          [847, "Shortest Path Visiting All Nodes", "H"],
          [1125, "Smallest Sufficient Team", "H"]
        ],
        tools: ["Bitset / Bitmask", "Breadth-First Search", "Memoization"],
        blocks: ["Dynamic Programming", "Bit Loop", "Constraints to Complexity", "Brute Force & Enumeration", "Hashable Keys"]
      }],
      ["Game Theory & Minimax DP", "Two players move optimally; dp stores the best score difference the player to move can force.", {
        tier: "stretch",
        recognize: "Two players alternate taking from the ends of an array, picking numbers, or removing stones, and you must decide who wins or by how much, assuming both play optimally.",
        idea: "State: dp[i][j] (or dp[state]) is the best score difference the CURRENT player can force from this position. Transition: dp = max over moves of (gain of the move - dp[next position]), because the opponent becomes the current player. Base case: no moves left gives 0. A win/lose state is winning if any move leads to a losing state for the opponent.",
        template: `def predict_the_winner(nums):
    n = len(nums)
    dp = [[0] * n for _ in range(n)]   # best (me - opponent) on nums[i..j]
    for i in range(n - 1, -1, -1):
        dp[i][i] = nums[i]
        for j in range(i + 1, n):
            dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])
    return dp[0][n-1] >= 0

from functools import cache
def can_i_win(max_int, total):
    if max_int * (max_int + 1) // 2 < total:
        return False
    @cache
    def win(mask, remaining):
        for x in range(1, max_int + 1):
            bit = 1 << x
            if not mask & bit:
                if x >= remaining or not win(mask | bit, remaining - x):
                    return True
        return False
    return win(0, total)`,
        pitfalls: "Storing each player's raw score separately instead of the difference, which doubles the state. Forgetting that the opponent also plays optimally. Missing the shortcut proofs (Stone Game always returns True; Nim is decided by n % 4).",
        staff: "Explain the 'score difference' trick and why it makes the recurrence symmetric. Mention that some games have closed-form answers (Nim, Sprague-Grundy numbers), and say you'd look for one after writing the DP. Reconstruct the optimal play by recording which move won at each state.",
        problems: [
          [292, "Nim Game", "E"],
          [877, "Stone Game", "M"],
          [486, "Predict the Winner", "M"],
          [464, "Can I Win", "M"],
          [1406, "Stone Game III", "H"]
        ],
        tools: ["Memoization", "functools.cache", "Bitset / Bitmask"],
        blocks: ["Dynamic Programming", "Induction", "Base Case", "Reverse Scan", "Recursive Case"]
      }],
      ["Digit DP", "Count numbers up to N with a digit property by walking N's digits with a 'still tight to N' flag.", {
        tier: "awareness",
        recognize: "Count integers in [0, N] or [L, R] whose digits satisfy a rule (no repeated digits, no consecutive 1 bits, built from a digit set, how many 1s appear), where N can be 10^9 or more so you can't enumerate.",
        idea: "State: (position, tight, extra info such as a digit mask or 'started' flag). Transition: at each position try digits 0..limit, where limit is N's digit if tight else 9; the next tight is tight and digit == limit. Base case: past the last digit, return 1 if the number is valid. Answer for [L, R] = f(R) - f(L - 1).",
        template: `from functools import cache

def count_no_repeat(n):          # numbers in [1, n] with all distinct digits
    digits = list(map(int, str(n)))
    @cache
    def go(pos, mask, tight, started):
        if pos == len(digits):
            return 1 if started else 0
        limit = digits[pos] if tight else 9
        total = 0
        for d in range(limit + 1):
            if started and mask & (1 << d):
                continue
            now_started = started or d != 0
            new_mask = mask | (1 << d) if now_started else mask
            total += go(pos + 1, new_mask, tight and d == limit, now_started)
        return total
    return go(0, 0, True, False)`,
        pitfalls: "Leading zeros counting as used digits; track a 'started' flag. Forgetting the f(R) - f(L - 1) trick for a range. Caching on tight=True states is fine but there are only O(digits) of them.",
        staff: "Mostly an awareness topic for interviews. Recognise it from 'N up to 10^9 and a digit rule', name the state (pos, tight, mask), and estimate the state count (about 10 * 2 * 1024).",
        problems: [
          [357, "Count Numbers with Unique Digits", "M"],
          [902, "Numbers At Most N Given Digit Set", "H"],
          [600, "Non-negative Integers without Consecutive Ones", "H"],
          [233, "Number of Digit One", "H"]
        ],
        tools: ["Memoization", "functools.cache", "Bitset / Bitmask"],
        blocks: ["Dynamic Programming", "Digit Loop", "Boolean Flags", "Constraints to Complexity"]
      }],
      ["Probability & Expected Value DP", "dp holds the probability (or expected value) of being in a state after k steps; each step spreads probability to the next states.", {
        tier: "awareness",
        recognize: "Random moves or draws with known probabilities, and the question asks for the chance of ending in some condition or the expected number of steps.",
        idea: "State: dp[step][state] is the probability of being in state after step moves. Transition: dp[step+1][next] += dp[step][state] * p(move). Base case: dp[0][start] = 1. For 'draw until total >= K' problems, a sliding window sum of probabilities turns O(N * W) into O(N).",
        template: `def knight_probability(n, k, row, col):
    moves = [(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)]
    dp = [[0.0] * n for _ in range(n)]
    dp[row][col] = 1.0
    for _ in range(k):
        nxt = [[0.0] * n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                if dp[r][c]:
                    for dr, dc in moves:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < n:
                            nxt[nr][nc] += dp[r][c] / 8
        dp = nxt
    return sum(map(sum, dp))`,
        pitfalls: "Floating-point comparisons; answers are usually accepted within 1e-5. Double-counting probability mass by updating in place. Missing that some problems (Soup Servings) converge to 1 for large N, which is the trick for huge inputs.",
        staff: "Awareness level. Recognise it, write the step-by-step transition, and mention rolling two layers for O(state) space and the sliding-window speed-up for New 21 Game.",
        problems: [
          [688, "Knight Probability in Chessboard", "M"],
          [837, "New 21 Game", "M"],
          [808, "Soup Servings", "M"]
        ],
        tools: ["Matrix / Grid", "Array & Dynamic Array"],
        blocks: ["Dynamic Programming", "Floating-Point Precision", "Direction Arrays", "Bounds Checks"]
      }],
      ["DP with Monotonic Deque Optimisation", "When dp[i] takes the max of dp over a sliding window of previous indices, keep that window's max in a monotonic deque.", {
        tier: "stretch",
        recognize: "A 1D DP whose transition is dp[i] = nums[i] + max(dp[j]) for j in [i - k, i - 1], or a similar windowed best. The naive version is O(n * k) and n, k can both be 10^5.",
        idea: "State: dp[i] is the best value ending at i. Transition: dp[i] = nums[i] + max(dp[i-k..i-1]). Keep a deque of indices with decreasing dp values: pop from the back while the new dp is bigger, pop from the front when the index leaves the window. Base case: dp[0] = nums[0]. Each index enters and leaves the deque once, so it is O(n).",
        template: `from collections import deque

def constrained_subset_sum(nums, k):
    dp = nums[:]
    dq = deque()                      # indices, dp values decreasing
    for i in range(len(nums)):
        if dq and dq[0] < i - k:
            dq.popleft()              # left the window
        if dq:
            dp[i] = nums[i] + max(0, dp[dq[0]])
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()                  # dominated: older and smaller
        dq.append(i)
    return max(dp)`,
        pitfalls: "Storing values instead of indices, so you can't tell when the front left the window. Popping with < instead of <= (both work for max, but be consistent). Expiring the front after reading it instead of before.",
        staff: "State the naive O(n * k) DP first, then show which part is a sliding-window max and replace it. Argue the amortised O(n) bound. A heap with lazy deletion is an acceptable O(n log n) alternative if you blank on the deque.",
        problems: [
          [1696, "Jump Game VI", "M"],
          [1425, "Constrained Subsequence Sum", "H"],
          [1499, "Max Value of Equation", "H"]
        ],
        tools: ["Deque", "collections: deque, Counter, defaultdict", "heapq"],
        blocks: ["Dynamic Programming", "Amortized Analysis", "Monotonicity", "Loop Invariants"]
      }]
    ]
  });

  PATTERNS.push({
    name: "Greedy",
    layer: "Patterns",
    blurb: "Make the locally best choice and prove it never hurts: by an exchange argument, or by keeping an invariant like 'farthest reachable so far'.",
    items: [
      ["Greedy: Sort Then Choose", "Sort by the right key, then make one pass that commits to the best choice at each step.", {
        tier: "core",
        recognize: "Pair or assign items (children to cookies, people to boats, people to two cities) where an order exists that makes the best choice obvious once sorted. Often 'minimise the number of groups' or 'maximise the number satisfied'.",
        idea: "Find the sort key that makes the choice safe: smallest cookie that satisfies the least greedy child, heaviest person paired with the lightest, sort by the cost difference between city A and city B. Prove it with an exchange argument: any optimal solution can be rearranged to match the greedy one without getting worse.",
        template: `def num_rescue_boats(people, limit):
    people.sort()
    i, j, boats = 0, len(people) - 1, 0
    while i <= j:
        if people[i] + people[j] <= limit:
            i += 1                  # lightest rides with heaviest
        j -= 1                      # heaviest always leaves
        boats += 1
    return boats

def two_city_sched_cost(costs):
    costs.sort(key=lambda c: c[0] - c[1])   # most A-favoured first
    n = len(costs) // 2
    return sum(c[0] for c in costs[:n]) + sum(c[1] for c in costs[n:])`,
        pitfalls: "Choosing the wrong sort key; test it on a small counterexample before coding. For Queue Reconstruction by Height, sort height descending and k ascending, then insert at index k. Assuming greedy works without a proof when DP is actually needed.",
        staff: "Say the exchange argument out loud in two sentences; that's the difference between a guess and a solution. Show one counterexample for a tempting wrong key. If the data is too large to sort in memory, external sort it, or use counting sort when the key range is small.",
        problems: [
          [455, "Assign Cookies", "E"],
          [881, "Boats to Save People", "M"],
          [1029, "Two City Scheduling", "M"],
          [406, "Queue Reconstruction by Height", "M"],
          [870, "Advantage Shuffle", "M"]
        ],
        tools: ["Comparison Sort & Comparators", "Array & Dynamic Array"],
        blocks: ["Greedy Choice", "Exchange Argument", "Comparators", "Tie-Breaking", "Two-Index While Loop"]
      }],
      ["Greedy Reachability", "Sweep once, tracking the farthest point you can reach (or the current fuel balance), and decide as you go.", {
        tier: "core",
        recognize: "Can you reach the end, how many jumps or segments do you need, which start position lets you complete the loop, or how to cut a string into the most parts. A single 'farthest so far' or 'running balance' value captures everything.",
        idea: "Jump Game: farthest = max(farthest, i + nums[i]); fail if i > farthest. Jump Game II is BFS by layers: the current layer ends at curEnd, and the next layer reaches farthest. Gas Station: if the total gas >= total cost an answer exists, and the start is just after the last point where the running tank went negative.",
        template: `def can_jump(nums):
    farthest = 0
    for i, step in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + step)
    return True

def jump(nums):
    jumps, cur_end, farthest = 0, 0, 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:             # finished this layer
            jumps += 1
            cur_end = farthest
    return jumps

def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    tank, start = 0, 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start, tank = i + 1, 0
    return start`,
        pitfalls: "Jump Game II looping to the last index and counting one jump too many. Gas Station forgetting the total check, which is what proves the chosen start works. Partition Labels needs each character's last index precomputed first.",
        staff: "Explain the invariant ('farthest is the furthest index reachable using indices up to i') and why one pass suffices. Point out that Jump Game II is BFS without a queue. Contrast with DP: the DP version is O(n^2) and is the fallback if the greedy proof isn't clear.",
        problems: [
          [55, "Jump Game", "M"],
          [45, "Jump Game II", "M"],
          [134, "Gas Station", "M"],
          [763, "Partition Labels", "M"],
          [1024, "Video Stitching", "M"]
        ],
        tools: ["Array & Dynamic Array", "Hash Map"],
        blocks: ["Greedy Choice", "Running Best-So-Far", "Loop Invariants", "Single Pass", "Accumulators"]
      }],
      ["Greedy with a Heap", "Commit greedily as you sweep, and keep the choices in a heap so you can swap out the worst one when a better option appears.", {
        tier: "google",
        recognize: "Scheduling or resource use where you want as many items as possible within a budget, and a later item can make an earlier choice look bad: courses with deadlines, ladders vs bricks, refuelling stops, events per day, rearranging so no two neighbours match.",
        idea: "Sweep in time or position order. Tentatively take each item and push it on a heap; when the budget is exceeded, pop the worst item taken so far (longest course, biggest climb paid with bricks). The heap always holds the best set seen so far, so one pass with O(log n) updates is enough.",
        template: `import heapq

def schedule_course(courses):
    courses.sort(key=lambda c: c[1])        # by deadline
    taken, time = [], 0                     # max-heap of durations
    for dur, last in courses:
        heapq.heappush(taken, -dur)
        time += dur
        if time > last:
            time += heapq.heappop(taken)     # drop the longest course
    return len(taken)

def furthest_building(heights, bricks, ladders):
    climbs = []                              # min-heap of climbs using ladders
    for i in range(len(heights) - 1):
        d = heights[i+1] - heights[i]
        if d > 0:
            heapq.heappush(climbs, d)
            if len(climbs) > ladders:
                bricks -= heapq.heappop(climbs)  # smallest climb uses bricks
                if bricks < 0:
                    return i
    return len(heights) - 1`,
        pitfalls: "Python's heapq is a min-heap; negate values for a max-heap. Sorting by the wrong key (start time instead of deadline). Reorganize String: always place the most frequent remaining character that isn't the previous one, and detect the impossible case (max count > (n + 1) // 2).",
        staff: "Explain the swap argument: replacing the worst chosen item with a cheaper one never reduces the count. Give the O(n log n) cost. For a stream of jobs, the same heap works online. Mention the ordered-map alternative if you also need to remove arbitrary items.",
        problems: [
          [767, "Reorganize String", "M"],
          [1642, "Furthest Building You Can Reach", "M"],
          [1353, "Maximum Number of Events That Can Be Attended", "M"],
          [630, "Course Schedule III", "H"],
          [871, "Minimum Number of Refueling Stops", "H"]
        ],
        tools: ["Binary Heap", "heapq", "Comparison Sort & Comparators", "Counter / Frequency Map"],
        blocks: ["Greedy Choice", "Exchange Argument", "Single Pass", "Running Best-So-Far"]
      }],
      ["Monotonic-Stack String Greedy", "Build the smallest (or largest) result left to right, popping earlier characters while a smaller one arrives and you can still afford to drop them.", {
        tier: "google",
        recognize: "Remove k digits to get the smallest number, remove duplicate letters to get the smallest lexicographic string, or pick k digits to form the biggest number. 'Smallest lexicographic' plus 'remove or choose' is the trigger.",
        idea: "Earlier positions matter more, so a smaller character should replace a bigger one before it whenever that is still allowed. Keep the result in a stack: while the top is bigger than the new character and dropping it is allowed (k > 0, or the top appears again later), pop it. The stack stays increasing.",
        template: `def remove_k_digits(num, k):
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop()
            k -= 1
        stack.append(d)
    stack = stack[:len(stack) - k]          # drop leftovers from the end
    return ''.join(stack).lstrip('0') or '0'

def remove_duplicate_letters(s):
    last = {c: i for i, c in enumerate(s)}
    stack, in_stack = [], set()
    for i, c in enumerate(s):
        if c in in_stack:
            continue
        while stack and stack[-1] > c and last[stack[-1]] > i:
            in_stack.remove(stack.pop())    # it appears again later
        stack.append(c)
        in_stack.add(c)
    return ''.join(stack)`,
        pitfalls: "Forgetting leftover k when the digits are already increasing (trim from the end). Leading zeros and the empty result '0'. In Remove Duplicate Letters, skipping a character already in the stack, and only popping if it appears later.",
        staff: "Argue why the first differing position decides lexicographic order, which justifies popping. Note 1081 is the same problem as 316. For Create Maximum Number, combine this with merging two sequences and trying every split, and state its complexity.",
        problems: [
          [402, "Remove K Digits", "M"],
          [316, "Remove Duplicate Letters", "M"],
          [1081, "Smallest Subsequence of Distinct Characters", "M"],
          [321, "Create Maximum Number", "H"]
        ],
        tools: ["Stack", "Hash Map", "Hash Set"],
        blocks: ["Greedy Choice", "Monotonicity", "Loop Invariants", "Precomputation", "Guard Clauses & Early Return"]
      }],
      ["Two-Pass Greedy & Exchange Argument", "Satisfy constraints from both sides with a left pass and a right pass, or prove a sort order by swapping neighbours.", {
        tier: "stretch",
        recognize: "Each element has a constraint relative to both neighbours (more candy than a higher-rated neighbour), or the order of tasks matters and you need the order that never fails (tasks with a minimum energy requirement).",
        idea: "Candy: a left-to-right pass handles 'bigger than the left neighbour', a right-to-left pass handles 'bigger than the right neighbour', and taking the max satisfies both. For ordering problems, compare two adjacent items a, b: if putting a first is never worse, that comparison is the sort key. Minimum Initial Energy sorts by (minimum - actual) descending.",
        template: `def candy(ratings):
    n = len(ratings)
    give = [1] * n
    for i in range(1, n):                    # left neighbour rule
        if ratings[i] > ratings[i-1]:
            give[i] = give[i-1] + 1
    for i in range(n - 2, -1, -1):           # right neighbour rule
        if ratings[i] > ratings[i+1]:
            give[i] = max(give[i], give[i+1] + 1)
    return sum(give)

def minimum_effort(tasks):
    tasks.sort(key=lambda t: t[1] - t[0], reverse=True)  # by slack
    energy = need = 0
    for actual, minimum in tasks:
        if energy < minimum:
            need += minimum - energy
            energy = minimum
        energy -= actual
    return need`,
        pitfalls: "Trying to satisfy both neighbours in one pass. In the right pass, overwriting the left-pass value instead of taking the max. Proving an order by intuition; check it with the swap of two adjacent items.",
        staff: "Write the two-line exchange argument for the sort key. Mention the O(1)-space Candy variant (count up and down slopes) only if asked. Relate two-pass greedy to prefix/suffix decomposition: each pass is a constraint from one direction.",
        problems: [
          [921, "Minimum Add to Make Parentheses Valid", "M"],
          [1846, "Maximum Element After Decreasing and Rearranging", "M"],
          [135, "Candy", "H"],
          [1665, "Minimum Initial Energy to Finish Tasks", "H"]
        ],
        tools: ["Array & Dynamic Array", "Comparison Sort & Comparators"],
        blocks: ["Exchange Argument", "Two Pass", "Reverse Scan", "Greedy Choice", "Comparators"]
      }]
    ]
  });
  PATTERNS.push({
    name: "Bits, Math & Randomness",
    layer: "Patterns",
    blurb: "Binary representation tricks, number theory and sampling: short code, but only if you know the trick.",
    items: [
      ["XOR Cancellation Tricks", "a ^ a = 0 and a ^ 0 = a, so XOR-ing everything cancels pairs and leaves the odd one out in O(1) space.", {
        tier: "core",
        recognize: "Every element appears twice (or k times) except one; find a missing number with no extra space; add without + or -.",
        idea: "XOR is its own inverse and is commutative, so order doesn't matter and duplicates vanish. For two unknowns, XOR all to get a ^ b, then split the numbers by any set bit of that result. For k-times duplicates, count each bit position mod k.",
        template: `def single_number(nums):
    acc = 0
    for x in nums:
        acc ^= x          # pairs cancel
    return acc

def missing_number(nums):
    acc = len(nums)
    for i, x in enumerate(nums):
        acc ^= i ^ x      # indices and values pair up
    return acc

def add(a, b):            # 32-bit, works in Python with a mask
    MASK = 0xFFFFFFFF
    while b & MASK:
        a, b = (a ^ b), (a & b) << 1
    return a & MASK if b > 0 else a`,
        pitfalls: "Python ints are unbounded, so bit-arithmetic like Sum of Two Integers needs a 32-bit mask and a sign fix-up. Splitting by 'lowest set bit' uses x & -x, not x & (x - 1).",
        staff: "Explain why XOR beats a hash set here: O(1) space and a single pass, which matters when the data is a stream you can't store.",
        problems: [
          [136, "Single Number", "E"],
          [268, "Missing Number", "E"],
          [137, "Single Number II", "M"],
          [260, "Single Number III", "M"],
          [371, "Sum of Two Integers", "M"]
        ],
        tools: ["Bitset / Bitmask"],
        blocks: ["Bit Loop", "Accumulators", "Single Pass", "Integer Overflow & Safe Midpoint"]
      }],
      ["Bit Counting & Lowest Set Bit", "n & (n - 1) clears the lowest set bit and n & -n isolates it, which drives popcount, power-of-two checks and bit DP.", {
        tier: "core",
        recognize: "Count set bits, test power of two, reverse or extract bits, or build answers for 0..n from smaller answers.",
        idea: "n - 1 flips the lowest 1 and every 0 below it, so AND-ing removes exactly that bit; the loop runs once per set bit. For ranges, bits[i] = bits[i >> 1] + (i & 1) reuses the answer for i without its last bit.",
        template: `def popcount(n):
    count = 0
    while n:
        n &= n - 1        # drop lowest set bit
        count += 1
    return count

def counting_bits(n):
    bits = [0] * (n + 1)
    for i in range(1, n + 1):
        bits[i] = bits[i >> 1] + (i & 1)
    return bits

def reverse_bits(n):
    out = 0
    for _ in range(32):
        out = (out << 1) | (n & 1)
        n >>= 1
    return out`,
        pitfalls: "Negative numbers in Python never reach 0 under n &= n - 1; mask to 32 bits first. Reverse Bits must loop exactly 32 times, not until n is 0.",
        staff: "If Reverse Bits is called millions of times, cache reversed bytes in a 256-entry table and combine four lookups.",
        problems: [
          [191, "Number of 1 Bits", "E"],
          [338, "Counting Bits", "E"],
          [190, "Reverse Bits", "E"],
          [231, "Power of Two", "E"],
          [461, "Hamming Distance", "E"]
        ],
        tools: ["Bitset / Bitmask", "Array & Dynamic Array"],
        blocks: ["Bit Loop", "While Loops", "Precomputation", "Dynamic Programming"]
      }],
      ["Subset Enumeration by Bitmask", "Treat an integer 0..2^n - 1 as a set of chosen items, so subsets become plain loops instead of recursion.", {
        tier: "stretch",
        recognize: "n is small (about 20 or less) and you must try every subset, or a state is 'which items are used so far'.",
        idea: "Bit i of mask means item i is chosen. Loop mask from 0 to 2^n - 1, or walk only the submasks of a mask with sub = (sub - 1) & mask. Masks also make compact, hashable DP state.",
        template: `def all_subsets(items):
    n = len(items)
    out = []
    for mask in range(1 << n):
        out.append([items[i] for i in range(n) if mask >> i & 1])
    return out

def submasks(mask):
    sub = mask
    while sub:
        yield sub
        sub = (sub - 1) & mask
    yield 0`,
        pitfalls: "2^n blows up fast: 2^20 is about a million, 2^30 is too many. Operator precedence: write (mask >> i) & 1 with parentheses in languages where shifts bind loosely.",
        staff: "Mention meet-in-the-middle: split n = 40 into two halves of 2^20 subsets each, then combine with sorting and binary search.",
        problems: [
          [78, "Subsets", "M"],
          [2002, "Maximum Product of the Length of Two Palindromic Subsequences", "M"],
          [1601, "Maximum Number of Achievable Transfer Requests", "H"]
        ],
        tools: ["Bitset / Bitmask"],
        blocks: ["Brute Force & Enumeration", "Bit Loop", "Constraints to Complexity"]
      }],
      ["Number Theory: GCD, Mod & Fast Power", "Euclid's GCD, modular arithmetic, exponentiation by squaring and the sieve cover most math questions.", {
        tier: "google",
        recognize: "Answers 'modulo 10^9 + 7', huge exponents, prime counting, divisibility, ratios that must be reduced, or counting combinations.",
        idea: "gcd(a, b) = gcd(b, a % b). Fast power squares the base and halves the exponent, so x^n takes O(log n) multiplies. The sieve crosses out multiples of each prime from p*p. Apply mod after every multiply to keep numbers small.",
        template: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def power(x, n, mod=None):
    if n < 0:
        x, n = 1 / x, -n
    result = 1
    while n:
        if n & 1:
            result = result * x if mod is None else result * x % mod
        x = x * x if mod is None else x * x % mod
        n >>= 1
    return result

def count_primes(n):
    if n < 3:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for m in range(p * p, n, p):
                is_prime[m] = False
    return sum(is_prime)`,
        pitfalls: "Negative exponents and n = -2^31 overflow in fixed-width languages. In Java or C++, take mod before multiplying two values near 10^9 or the product overflows 64 bits. Use the modular inverse (pow(a, mod - 2, mod)) to divide under a prime mod.",
        staff: "Know Python's built-ins (math.gcd, pow(a, b, m), math.comb) but be ready to write them, and state the overflow story for the language the interviewer uses.",
        problems: [
          [50, "Pow(x, n)", "M"],
          [204, "Count Primes", "M"],
          [372, "Super Pow", "M"],
          [1979, "Find Greatest Common Divisor of Array", "E"],
          [29, "Divide Two Integers", "M"]
        ],
        tools: ["Array & Dynamic Array"],
        blocks: ["Integer Division, Floor & Ceil", "Negative Modulo", "Integer Overflow & Safe Midpoint", "Divide & Conquer", "Precomputation"]
      }],
      ["Random Sampling & Shuffling", "Reservoir sampling, Fisher-Yates and prefix-sum weighted picks give provably uniform randomness in one pass.", {
        tier: "google",
        recognize: "'Return a random element', 'each with equal probability', a stream of unknown length, weighted picks, or getRandom in O(1).",
        idea: "Reservoir: keep the i-th item with probability 1/i, which leaves every item equally likely. Fisher-Yates swaps position i with a random index in [i, n). Weighted pick: build prefix sums, draw r in [0, total) and binary-search the bucket.",
        template: `import random, bisect

def reservoir_pick(stream):
    chosen = None
    for i, x in enumerate(stream, 1):
        if random.randrange(i) == 0:   # probability 1/i
            chosen = x
    return chosen

def shuffle(a):
    for i in range(len(a) - 1, 0, -1):
        j = random.randint(0, i)
        a[i], a[j] = a[j], a[i]
    return a

class WeightedPicker:
    def __init__(self, weights):
        self.prefix = []
        total = 0
        for w in weights:
            total += w
            self.prefix.append(total)
    def pick(self):
        r = random.random() * self.prefix[-1]
        return bisect.bisect_right(self.prefix, r)`,
        pitfalls: "Swapping with any index in [0, n) instead of [i, n) gives a biased shuffle. Off-by-one between bisect_left and bisect_right skews weighted picks.",
        staff: "Be ready to prove uniformity by induction for reservoir sampling, and extend it to picking k items or to sampling across sharded streams.",
        problems: [
          [380, "Insert Delete GetRandom O(1)", "M"],
          [382, "Linked List Random Node", "M"],
          [384, "Shuffle an Array", "M"],
          [528, "Random Pick with Weight", "M"],
          [398, "Random Pick Index", "M"],
          [470, "Implement Rand10() Using Rand7()", "M"]
        ],
        tools: ["Binary Search", "bisect module", "Hash Map", "Array & Dynamic Array"],
        blocks: ["Randomization", "Induction", "Single Pass", "Precomputation"]
      }],
      ["Geometry Basics", "Slopes as reduced fractions, overlap as interval intersection on each axis, and cross products for orientation.", {
        tier: "awareness",
        recognize: "Points, lines, rectangles or squares on a grid; collinearity; area of overlap.",
        idea: "Two rectangles overlap if their x-intervals and y-intervals both overlap. Represent a slope as (dy, dx) divided by their gcd with a fixed sign, never as a float. Cross product sign tells left turn, right turn or collinear.",
        template: `from math import gcd
from collections import Counter

def max_points(points):
    best = 0
    for i, (x1, y1) in enumerate(points):
        slopes = Counter()
        for x2, y2 in points[i + 1:]:
            dx, dy = x2 - x1, y2 - y1
            g = gcd(dx, dy)
            dx, dy = dx // g, dy // g
            if dx < 0 or (dx == 0 and dy < 0):
                dx, dy = -dx, -dy
            slopes[(dx, dy)] += 1
        best = max(best, 1 + max(slopes.values(), default=0))
    return best

def overlap(a, b):          # rect = (x1, y1, x2, y2)
    return min(a[2], b[2]) > max(a[0], b[0]) and min(a[3], b[3]) > max(a[1], b[1])`,
        pitfalls: "Floating-point slopes give false mismatches. Touching edges usually do not count as overlap; read the problem.",
        staff: "Mention that spatial indexes (grids, quadtrees) answer 'nearby points' queries at scale instead of all-pairs checks.",
        problems: [
          [836, "Rectangle Overlap", "E"],
          [223, "Rectangle Area", "M"],
          [593, "Valid Square", "M"],
          [149, "Max Points on a Line", "H"]
        ],
        tools: ["Hash Map", "Counter / Frequency Map"],
        blocks: ["Floating-Point Precision", "Hashable Keys", "Pair Loops (i < j)"]
      }]
    ]
  });

  PATTERNS.push({
    name: "Advanced Strings",
    layer: "Patterns",
    blurb: "Prefix trees and linear-time matching for when brute-force substring checks are too slow.",
    items: [
      ["Trie: Prefix Search & Autocomplete", "A tree keyed by characters, so every word sharing a prefix shares a path and prefix queries cost O(length).", {
        tier: "google",
        recognize: "Many words and many prefix questions, autocomplete, wildcard lookups, searching a grid for a whole dictionary, or maximizing XOR bit by bit.",
        idea: "Each node maps a character to a child and marks whether a word ends there. Insert and search walk one node per character. Store extra data on nodes (counts, top suggestions, the word itself) to answer richer queries without re-walking.",
        template: `class TrieNode:
    __slots__ = ("children", "word")
    def __init__(self):
        self.children = {}
        self.word = None

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.word = word

    def _walk(self, prefix):
        node = self.root
        for ch in prefix:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.word is not None

    def starts_with(self, prefix):
        return self._walk(prefix) is not None`,
        pitfalls: "Forgetting the end-of-word marker makes 'app' match after inserting 'apple'. In Word Search II, prune found words from the trie or you re-report and time out.",
        staff: "Discuss memory: arrays of 26 vs dicts, compressed (radix) tries, and keeping top-k suggestions per node so autocomplete is O(prefix) per keystroke.",
        problems: [
          [208, "Implement Trie (Prefix Tree)", "M"],
          [211, "Design Add and Search Words Data Structure", "M"],
          [1268, "Search Suggestions System", "M"],
          [648, "Replace Words", "M"],
          [421, "Maximum XOR of Two Numbers in an Array", "M"],
          [212, "Word Search II", "H"]
        ],
        tools: ["Trie", "Hash Map", "Depth-First Search"],
        blocks: ["For Loops", "Sentinels", "Backtracking", "Space-Time Trade-off"]
      }],
      ["Rolling Hash / Rabin-Karp", "Hash every window of length L in O(1) each by sliding a polynomial hash, so substring equality checks become integer compares.", {
        tier: "stretch",
        recognize: "Repeated or duplicate substrings, comparing many substrings of the same length, or binary search on a length plus 'does a duplicate of this length exist'.",
        idea: "h = (h * base + c) mod M adds a character; removing the leftmost subtracts c * base^(L-1). Equal hashes are probably equal strings; verify or use two moduli to avoid collisions.",
        template: `def find_repeat(s, L, base=131, mod=(1 << 61) - 1):
    if L == 0 or L > len(s):
        return None
    high = pow(base, L - 1, mod)
    h = 0
    for ch in s[:L]:
        h = (h * base + ord(ch)) % mod
    seen = {h: 0}
    for i in range(L, len(s)):
        h = ((h - ord(s[i - L]) * high) * base + ord(s[i])) % mod
        start = i - L + 1
        if h in seen and s[seen[h]:seen[h] + L] == s[start:start + L]:
            return start
        seen.setdefault(h, start)
    return None`,
        pitfalls: "Collisions are real: double-hash or confirm with a direct compare. Python's % keeps results non-negative, but other languages need (x % M + M) % M.",
        staff: "Rolling hashes power real systems: rsync block matching, content-defined chunking for dedupe, and plagiarism detection.",
        problems: [
          [28, "Find the Index of the First Occurrence in a String", "E"],
          [187, "Repeated DNA Sequences", "M"],
          [718, "Maximum Length of Repeated Subarray", "M"],
          [1044, "Longest Duplicate Substring", "H"]
        ],
        tools: ["Hash Map", "Hash Set", "Binary Search"],
        blocks: ["Negative Modulo", "Precomputation", "Single Pass", "Randomization"]
      }],
      ["KMP Prefix Function", "For each prefix, the longest proper prefix that is also a suffix; it lets matching skip ahead without re-reading text.", {
        tier: "stretch",
        recognize: "Guaranteed O(n + m) pattern search, the longest prefix that is also a suffix, or whether a string is a repetition of a smaller block.",
        idea: "pi[i] is the length of the longest border of s[:i+1]. On a mismatch, fall back to pi[k - 1] instead of restarting. Matching pattern p in text t is computing pi on p + '#' + t.",
        template: `def prefix_function(s):
    pi = [0] * len(s)
    k = 0
    for i in range(1, len(s)):
        while k and s[i] != s[k]:
            k = pi[k - 1]
        if s[i] == s[k]:
            k += 1
        pi[i] = k
    return pi

def kmp_search(text, pattern):
    if not pattern:
        return 0
    pi = prefix_function(pattern)
    k = 0
    for i, ch in enumerate(text):
        while k and ch != pattern[k]:
            k = pi[k - 1]
        if ch == pattern[k]:
            k += 1
        if k == len(pattern):
            return i - k + 1
    return -1`,
        pitfalls: "Using pi[k] instead of pi[k - 1] on fallback. The separator in p + '#' + t must not appear in either string.",
        staff: "Know the trade-off: KMP is worst-case linear and needs no hashing, while Rabin-Karp is simpler to extend to many patterns or 2D.",
        problems: [
          [28, "Find the Index of the First Occurrence in a String", "E"],
          [459, "Repeated Substring Pattern", "E"],
          [214, "Shortest Palindrome", "H"],
          [1392, "Longest Happy Prefix", "H"]
        ],
        tools: ["Array & Dynamic Array", "String & String Builder"],
        blocks: ["While Loops", "Loop Invariants", "Amortized Analysis", "Precomputation"]
      }],
      ["Z-Algorithm", "z[i] is the length of the longest substring starting at i that matches a prefix of the string, computed in linear time.", {
        tier: "awareness",
        recognize: "Every position's match length against the prefix, or pattern matching as an alternative to KMP.",
        idea: "Keep the rightmost window [l, r) that matches a prefix. Inside it, reuse z[i - l] as a starting guess, then extend by direct comparison. Each character extends r at most once, so it's O(n).",
        template: `def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z`,
        pitfalls: "z[0] is conventionally 0 or n; be explicit. Forgetting the min with r - i overshoots the window.",
        staff: "Recognize it and say 'this is a Z-function / prefix-function problem'; few interviewers expect it coded from memory.",
        problems: [
          [1392, "Longest Happy Prefix", "H"],
          [2223, "Sum of Scores of Built Strings", "H"]
        ],
        tools: ["Array & Dynamic Array"],
        blocks: ["Two-Index While Loop", "Amortized Analysis", "Half-Open vs Closed Ranges"]
      }],
      ["Manacher's Longest Palindrome", "Finds the longest palindrome around every center in O(n) by mirroring radii inside the rightmost known palindrome.", {
        tier: "awareness",
        recognize: "Longest palindromic substring or counting palindromic substrings when O(n^2) expand-around-center is too slow.",
        idea: "Interleave a separator so even and odd palindromes look the same. For a center inside the current rightmost palindrome, start from the mirror's radius, then expand. The right edge only moves forward.",
        template: `def manacher(s):
    t = "#" + "#".join(s) + "#"
    n = len(t)
    radius = [0] * n
    center = right = 0
    for i in range(n):
        if i < right:
            radius[i] = min(right - i, radius[2 * center - i])
        while (i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n
               and t[i - radius[i] - 1] == t[i + radius[i] + 1]):
            radius[i] += 1
        if i + radius[i] > right:
            center, right = i, i + radius[i]
    best = max(range(n), key=lambda i: radius[i])
    start = (best - radius[best]) // 2
    return s[start:start + radius[best]]`,
        pitfalls: "Mapping indices back from the separated string is the usual bug. Expand-around-center is fine unless n is around 10^5 or more.",
        staff: "Lead with expand-around-center, then say Manacher makes it linear if the constraints demand it.",
        problems: [
          [5, "Longest Palindromic Substring", "M"],
          [647, "Palindromic Substrings", "M"]
        ],
        tools: ["String & String Builder", "Array & Dynamic Array"],
        blocks: ["Amortized Analysis", "Reduction / Transform", "Bounds Checks"]
      }],
      ["Suffix Arrays & Automata", "All suffixes sorted (plus LCP array) answer duplicate-substring and distinct-substring questions in near-linear time.", {
        tier: "awareness",
        recognize: "Longest repeated substring, number of distinct substrings, or many substring queries against one fixed text.",
        idea: "Sort suffixes by doubling: rank by first 1, 2, 4... characters. Adjacent suffixes in sorted order share the longest common prefixes; the LCP array (Kasai) exposes repeats. Distinct substrings = sum of (suffix length - LCP).",
        template: `def suffix_array(s):
    n, k = len(s), 1
    rank = [ord(c) for c in s]
    sa = list(range(n))
    while True:
        key = lambda i: (rank[i], rank[i + k] if i + k < n else -1)
        sa.sort(key=key)
        new = [0] * n
        for j in range(1, n):
            new[sa[j]] = new[sa[j - 1]] + (key(sa[j]) != key(sa[j - 1]))
        rank = new
        if rank[sa[-1]] == n - 1:
            return sa
        k <<= 1`,
        pitfalls: "This O(n log^2 n) version is fine for interviews; don't try to recall SA-IS. Rolling hash plus binary search is usually the expected answer instead.",
        staff: "Mention it as the structure behind full-text search indexes and genome tools, and name the hash-plus-binary-search alternative you'd actually code.",
        problems: [
          [1698, "Number of Distinct Substrings in a String", "M"],
          [1044, "Longest Duplicate Substring", "H"]
        ],
        tools: ["Comparison Sort & Comparators", "Array & Dynamic Array"],
        blocks: ["Tuple Comparison", "Precomputation", "Divide & Conquer"]
      }]
    ]
  });

  PATTERNS.push({
    name: "Range-Query Structures",
    layer: "Patterns",
    blurb: "Answering 'what's in this range' while the data keeps changing, faster than rescanning.",
    items: [
      ["Ordered Set: Floor, Ceiling & Range Scans", "A balanced BST or sorted list gives predecessor, successor and in-order range scans in O(log n).", {
        tier: "google",
        recognize: "'Closest value at or below x', 'latest version at or before time t', a sliding window that needs its min and max, or neighbors of a value in a changing set.",
        idea: "Keep keys sorted under inserts and deletes. Floor and ceiling are a binary search; range queries walk in order. In Python use sortedcontainers.SortedList, or bisect on a list per key when keys only grow (timestamps).",
        template: `import bisect
from sortedcontainers import SortedList

class TimeMap:                      # versioned values per key
    def __init__(self):
        self.times = {}
        self.values = {}
    def set(self, key, value, t):
        self.times.setdefault(key, []).append(t)   # timestamps increase
        self.values.setdefault(key, []).append(value)
    def get(self, key, t):
        ts = self.times.get(key, [])
        i = bisect.bisect_right(ts, t) - 1          # floor
        return self.values[key][i] if i >= 0 else ""

def near_duplicate(nums, k, t):     # Contains Duplicate III
    window = SortedList()
    for i, x in enumerate(nums):
        j = window.bisect_left(x - t)
        if j < len(window) and window[j] <= x + t:
            return True
        window.add(x)
        if i >= k:
            window.remove(nums[i - k])
    return False`,
        pitfalls: "bisect_left vs bisect_right decides whether equal keys count as floor. If sortedcontainers isn't allowed, say so and use a heap with lazy deletion or a bucket trick instead.",
        staff: "Tie it to real systems: LSM-tree memtables and MVCC version chains are ordered maps answering 'latest version at or before t'.",
        problems: [
          [981, "Time Based Key-Value Store", "M"],
          [1146, "Snapshot Array", "M"],
          [2034, "Stock Price Fluctuation", "M"],
          [846, "Hand of Straights", "M"],
          [1438, "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", "M"],
          [220, "Contains Duplicate III", "H"]
        ],
        tools: ["Ordered Map / Sorted List", "sortedcontainers", "bisect module", "Binary Search"],
        blocks: ["Half-Open vs Closed Ranges", "Off-by-One Errors", "Monotonicity"]
      }],
      ["Fenwick Tree Prefix Counts", "A binary indexed tree supports point update and prefix sum in O(log n) with about ten lines of code.", {
        tier: "stretch",
        recognize: "Prefix sums on an array that also gets updates, or 'how many earlier elements are smaller' counting after coordinate compression.",
        idea: "Index i stores the sum of a block whose size is i's lowest set bit. Update climbs with i += i & -i; query descends with i -= i & -i. Counting inversions = iterate values, query how many seen are bigger, then add the value.",
        template: `class Fenwick:
    def __init__(self, n):
        self.tree = [0] * (n + 1)     # 1-indexed
    def add(self, i, delta):
        i += 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i
    def prefix(self, i):              # sum of [0, i)
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total
    def range_sum(self, lo, hi):      # sum of [lo, hi)
        return self.prefix(hi) - self.prefix(lo)

def count_smaller_after(nums):
    ranks = {v: r for r, v in enumerate(sorted(set(nums)))}
    bit, out = Fenwick(len(ranks)), []
    for x in reversed(nums):
        out.append(bit.prefix(ranks[x]))
        bit.add(ranks[x], 1)
    return out[::-1]`,
        pitfalls: "Mixing 0- and 1-indexing is the classic bug. Large or negative values need coordinate compression first.",
        staff: "Explain why it beats a segment tree here (less code, smaller constant) and when it doesn't (range min/max, range assignment).",
        problems: [
          [307, "Range Sum Query - Mutable", "M"],
          [1395, "Count Number of Teams", "M"],
          [315, "Count of Smaller Numbers After Self", "H"],
          [493, "Reverse Pairs", "H"],
          [308, "Range Sum Query 2D - Mutable", "H"]
        ],
        tools: ["Fenwick Tree", "Hash Map", "Comparison Sort & Comparators"],
        blocks: ["Bit Loop", "Half-Open vs Closed Ranges", "Zero-Based Indexing", "Reduction / Transform"]
      }],
      ["Segment Tree Range Queries", "A tree over array ranges answering any associative query (sum, min, max, count) with updates in O(log n), plus lazy range updates.", {
        tier: "stretch",
        recognize: "Range min, max or sum with point or range updates; intervals added over time with 'max overlap so far'; the skyline or falling squares.",
        idea: "Each node covers [lo, hi) and stores the combine of its children. Query splits the range across O(log n) nodes. Lazy propagation stores a pending update on a node and pushes it down only when a child is visited.",
        template: `class SegmentTree:                 # range max with point assign
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (2 * n)
    def update(self, i, value):
        i += self.n
        self.tree[i] = value
        while i > 1:
            i //= 2
            self.tree[i] = max(self.tree[2 * i], self.tree[2 * i + 1])
    def query(self, lo, hi):          # max over [lo, hi)
        res = float("-inf")
        lo += self.n
        hi += self.n
        while lo < hi:
            if lo & 1:
                res = max(res, self.tree[lo]); lo += 1
            if hi & 1:
                hi -= 1; res = max(res, self.tree[hi])
            lo //= 2
            hi //= 2
        return res`,
        pitfalls: "Recursive versions need 4n space; this iterative one needs 2n. Lazy propagation bugs come from forgetting to push down before recursing into children.",
        staff: "Know when it's overkill: if there are no updates, use a prefix sum or sparse table; if only intervals are added, a sweep line or ordered map often suffices.",
        problems: [
          [307, "Range Sum Query - Mutable", "M"],
          [699, "Falling Squares", "H"],
          [732, "My Calendar III", "H"],
          [715, "Range Module", "H"],
          [218, "The Skyline Problem", "H"],
          [2407, "Longest Increasing Subsequence II", "H"]
        ],
        tools: ["Segment Tree", "Array & Dynamic Array"],
        blocks: ["Divide & Conquer", "Half-Open vs Closed Ranges", "Recursive Case", "Big-O Time & Space"]
      }],
      ["Merge-Sort Counting", "Count cross pairs while merging two sorted halves, turning O(n^2) pair counting into O(n log n).", {
        tier: "stretch",
        recognize: "Count pairs i < j with some order condition: inversions, reverse pairs, range sums within bounds.",
        idea: "Sort each half recursively. Before merging, both halves are sorted, so a two-pointer sweep counts how many right elements satisfy the condition for each left element. Then merge as usual.",
        template: `def count_reverse_pairs(nums):
    def sort(lo, hi):                 # sorts nums[lo:hi], returns count
        if hi - lo <= 1:
            return 0
        mid = (lo + hi) // 2
        count = sort(lo, mid) + sort(mid, hi)
        j = mid
        for i in range(lo, mid):
            while j < hi and nums[i] > 2 * nums[j]:
                j += 1
            count += j - mid
        nums[lo:hi] = sorted(nums[lo:hi])   # or a manual merge
        return count
    return sort(0, len(nums))`,
        pitfalls: "Count before merging, not during, when the condition differs from the sort order. Using sorted() in the merge step is O(n log^2 n); write the merge if asked for O(n log n).",
        staff: "Mention that the same split-count-merge idea parallelizes: count within shards, then count cross-shard pairs.",
        problems: [
          [null, "Count Inversions in an Array", "M"],
          [315, "Count of Smaller Numbers After Self", "H"],
          [493, "Reverse Pairs", "H"],
          [327, "Count of Range Sum", "H"]
        ],
        tools: ["Merge Procedure", "Array & Dynamic Array"],
        blocks: ["Divide & Conquer", "Two-Index While Loop", "Recurrences & Master Theorem"]
      }],
      ["Sparse Table Static RMQ", "Precompute minimums over every power-of-two window so any range-min query on a fixed array is O(1).", {
        tier: "awareness",
        recognize: "Many range min or max queries on an array that never changes.",
        idea: "table[k][i] = min of the window of length 2^k starting at i. A query [l, r) covers itself with two overlapping windows of length 2^k where 2^k is the largest power at most r - l. Overlap is harmless for min and max.",
        template: `def build_sparse(a):
    table = [a[:]]
    k = 1
    while (1 << k) <= len(a):
        prev = table[-1]
        half = 1 << (k - 1)
        table.append([min(prev[i], prev[i + half])
                      for i in range(len(a) - (1 << k) + 1)])
        k += 1
    return table

def range_min(table, l, r):           # min of a[l:r], r > l
    k = (r - l).bit_length() - 1
    return min(table[k][l], table[k][r - (1 << k)])`,
        pitfalls: "Only works for idempotent operations (min, max, gcd), not sums. Any update forces a full rebuild.",
        staff: "Name it when the interviewer says the data is static and queries are huge in number; otherwise a segment tree is more flexible.",
        problems: [
          [null, "Range Minimum Query on a Static Array", "M"],
          [239, "Sliding Window Maximum", "H"]
        ],
        tools: ["Sparse Table", "Array & Dynamic Array"],
        blocks: ["Precomputation", "Space-Time Trade-off", "Half-Open vs Closed Ranges"]
      }],
      ["Sqrt Decomposition & Mo's Algorithm", "Split the array into about sqrt(n) blocks, or reorder offline queries, so each query costs about O(sqrt n).", {
        tier: "awareness",
        recognize: "Many range queries for things that don't combine nicely (distinct count, mode) and can be answered offline.",
        idea: "Mo's sorts queries by (block of left end, right end) so the two window pointers move about O((n + q) sqrt n) in total, adding and removing one element at a time. Sqrt decomposition keeps a summary per block for online queries.",
        template: `def mo_distinct(a, queries):         # queries: list of (l, r) half-open
    block = max(1, int(len(a) ** 0.5))
    order = sorted(range(len(queries)),
                   key=lambda q: (queries[q][0] // block, queries[q][1]))
    count, distinct = {}, 0
    cur_l = cur_r = 0
    answers = [0] * len(queries)
    def add(x):
        nonlocal distinct
        count[x] = count.get(x, 0) + 1
        distinct += count[x] == 1
    def remove(x):
        nonlocal distinct
        count[x] -= 1
        distinct -= count[x] == 0
    for q in order:
        l, r = queries[q]
        while cur_r < r: add(a[cur_r]); cur_r += 1
        while cur_l > l: cur_l -= 1; add(a[cur_l])
        while cur_r > r: cur_r -= 1; remove(a[cur_r])
        while cur_l < l: remove(a[cur_l]); cur_l += 1
        answers[q] = distinct
    return answers`,
        pitfalls: "Only works offline (all queries known up front). The window moves must expand before they shrink to keep counts valid.",
        staff: "Recognize it and say why: offline processing and a cheap add/remove step. In an interview, a simpler O(n log n) offline trick usually exists.",
        problems: [
          [null, "Distinct Elements in Many Subarray Queries", "H"],
          [1157, "Online Majority Element In Subarray", "H"]
        ],
        tools: ["Hash Map", "Comparison Sort & Comparators"],
        blocks: ["Tuple Comparison", "Amortized Analysis", "Constraints to Complexity"]
      }]
    ]
  });

  PATTERNS.push({
    name: "Design a Data Structure",
    layer: "Patterns",
    blurb: "Compose two or three basic structures so every operation hits its target cost. A Google favourite.",
    items: [
      ["LRU & LFU Caches", "A hash map for O(1) lookup plus a doubly linked list (or per-frequency lists) for O(1) eviction order.", {
        tier: "google",
        recognize: "'Evict the least recently / least frequently used', fixed capacity, get and put in O(1).",
        idea: "The map points to list nodes, so you can unlink any node in O(1). Most recent goes to the head; evict from the tail. LFU keeps one LRU list per frequency plus a pointer to the minimum frequency.",
        template: `class Node:
    __slots__ = ("key", "val", "prev", "next")
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()       # sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _unlink(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _push_front(self, node):
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        node = self.map.get(key)
        if not node:
            return -1
        self._unlink(node)
        self._push_front(node)
        return node.val

    def put(self, key, val):
        if key in self.map:
            self._unlink(self.map[key])
        node = self.map[key] = Node(key, val)
        self._push_front(node)
        if len(self.map) > self.cap:
            lru = self.tail.prev
            self._unlink(lru)
            del self.map[lru.key]`,
        pitfalls: "Forgetting to store the key in the node means you can't delete it from the map on eviction. Interviewers may forbid OrderedDict; know the manual version.",
        staff: "Discuss thread safety (one lock, or sharded caches), approximate LRU (CLOCK, sampled eviction as in Redis) and TTL expiry.",
        problems: [
          [146, "LRU Cache", "M"],
          [460, "LFU Cache", "H"],
          [432, "All O`one Data Structure", "H"]
        ],
        tools: ["Hash Map", "Linked List", "LinkedHashMap / OrderedDict"],
        blocks: ["Sentinels", "Reference vs Copy", "Amortized Analysis"]
      }],
      ["Insert, Delete & GetRandom in O(1)", "An array for uniform random access plus a value-to-index map; delete by swapping with the last element.", {
        tier: "google",
        recognize: "A set that must support random sampling, or 'all operations average O(1)'.",
        idea: "Arrays give O(1) random index; maps give O(1) find. To delete from the middle, move the last element into the hole, fix its index in the map, then pop. For duplicates, map each value to a set of indices.",
        template: `import random

class RandomizedSet:
    def __init__(self):
        self.vals = []
        self.pos = {}

    def insert(self, val):
        if val in self.pos:
            return False
        self.pos[val] = len(self.vals)
        self.vals.append(val)
        return True

    def remove(self, val):
        i = self.pos.pop(val, None)
        if i is None:
            return False
        last = self.vals.pop()
        if i < len(self.vals):          # val wasn't the last element
            self.vals[i] = last
            self.pos[last] = i
        return True

    def get_random(self):
        return random.choice(self.vals)`,
        pitfalls: "Removing the last element itself: don't write it back into the hole. Update the map for the moved element before popping.",
        staff: "Extend to weighted random or to random-without-replacement, and talk about how this backs sampling in load balancers or A/B assignment.",
        problems: [
          [380, "Insert Delete GetRandom O(1)", "M"],
          [381, "Insert Delete GetRandom O(1) - Duplicates allowed", "H"],
          [710, "Random Pick with Blacklist", "H"]
        ],
        tools: ["Array & Dynamic Array", "Hash Map"],
        blocks: ["Swap", "Randomization", "Bounds Checks"]
      }],
      ["Iterator Design", "Wrap a source behind next() and has_next() that do lazy, bounded work, often holding one look-ahead element.", {
        tier: "google",
        recognize: "'Implement an iterator', peeking, interleaving several iterators, flattening nested lists, or walking a BST in order step by step.",
        idea: "Keep exactly the state needed to produce the next item: a cached peek value, a queue of active iterators, or a stack of pending nodes. Do the work in has_next() (or a helper) so next() is just 'return the cached item'.",
        template: `from collections import deque

_END = object()                     # sentinel: None may be a real value

class PeekingIterator:
    def __init__(self, it):
        self.it = it
        self._advance()
    def _advance(self):
        self.nxt = next(self.it, _END)
    def peek(self):
        return self.nxt
    def next(self):
        val = self.nxt
        self._advance()
        return val
    def has_next(self):
        return self.nxt is not _END

class ZigzagIterator:
    def __init__(self, *lists):
        its = (PeekingIterator(iter(l)) for l in lists)
        self.queue = deque(it for it in its if it.has_next())
    def next(self):
        it = self.queue.popleft()
        val = it.next()
        if it.has_next():
            self.queue.append(it)      # round-robin
        return val
    def has_next(self):
        return bool(self.queue)`,
        pitfalls: "Using None as the 'exhausted' marker breaks when None is a real value; keep a separate flag. Don't flatten everything eagerly in the constructor if the interviewer cares about memory.",
        staff: "Talk about laziness: iterators let you process inputs larger than memory and compose pipelines (merge k sorted streams, paginated APIs).",
        problems: [
          [284, "Peeking Iterator", "M"],
          [281, "Zigzag Iterator", "M"],
          [341, "Flatten Nested List Iterator", "M"],
          [173, "Binary Search Tree Iterator", "M"],
          [251, "Flatten 2D Vector", "M"],
          [900, "RLE Iterator", "M"]
        ],
        tools: ["Stack", "Queue", "Deque", "collections: deque, Counter, defaultdict"],
        blocks: ["Recursion to Explicit Stack", "Sentinels", "Boolean Flags", "Pre & Postconditions"]
      }],
      ["Versioned & Time-Based Stores", "Keep per-key history as (version, value) pairs in sorted order and binary-search for the value at a given time or snapshot.", {
        tier: "google",
        recognize: "'Get the value at timestamp t', 'snapshot and read old versions', or counts per time bucket.",
        idea: "Don't copy the whole structure on snapshot. Append (snap_id, value) to that key's history only when it changes, then floor-search the history. Timestamps that only increase keep the lists sorted for free.",
        template: `import bisect

class SnapshotArray:
    def __init__(self, length):
        self.history = [[(-1, 0)] for _ in range(length)]
        self.snap_id = 0

    def set(self, index, val):
        h = self.history[index]
        if h[-1][0] == self.snap_id:
            h[-1] = (self.snap_id, val)     # overwrite within this snapshot
        else:
            h.append((self.snap_id, val))

    def snap(self):
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index, snap_id):
        h = self.history[index]
        i = bisect.bisect_right(h, (snap_id, float("inf"))) - 1
        return h[i][1]`,
        pitfalls: "Copying the full array on every snap is O(n) per snap and fails large tests. bisect on tuples needs a high second element so equal snap ids are included.",
        staff: "Connect it to MVCC in databases and copy-on-write snapshots; discuss compaction of old versions and memory bounds.",
        problems: [
          [981, "Time Based Key-Value Store", "M"],
          [1146, "Snapshot Array", "M"],
          [1348, "Tweet Counts Per Frequency", "M"]
        ],
        tools: ["Hash Map", "Binary Search", "bisect module", "Array & Dynamic Array"],
        blocks: ["Tuple Comparison", "Space-Time Trade-off", "Off-by-One Errors"]
      }],
      ["Rate Limiters, Hit Counters & Ring Buffers", "Fixed-size circular buffers or queues of timestamps answer 'how many in the last N seconds' in bounded memory.", {
        tier: "google",
        recognize: "'At most once every 10 seconds', 'hits in the past 5 minutes', a fixed-capacity queue, or throttling.",
        idea: "A deque of timestamps pops entries older than the window. With a fixed window size, use a ring buffer of buckets indexed by t % size and reset a bucket when its stored time is stale. Token bucket refills tokens based on elapsed time.",
        template: `from collections import deque

class Logger:
    def __init__(self):
        self.next_ok = {}
    def should_print(self, t, msg):
        if t < self.next_ok.get(msg, 0):
            return False
        self.next_ok[msg] = t + 10
        return True

class HitCounter:                    # 300-second window, O(300) memory
    def __init__(self, window=300):
        self.window = window
        self.times = [0] * window
        self.counts = [0] * window
    def hit(self, t):
        i = t % self.window
        if self.times[i] != t:
            self.times[i], self.counts[i] = t, 0
        self.counts[i] += 1
    def get_hits(self, t):
        return sum(c for ts, c in zip(self.times, self.counts)
                   if t - ts < self.window)

class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate, self.capacity = rate, capacity
        self.tokens, self.last = capacity, 0.0
    def allow(self, now):
        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False`,
        pitfalls: "The Logger map grows forever; mention cleaning old keys. Off-by-one at the window edge (< vs <=) is the usual bug.",
        staff: "Discuss distributed rate limiting (shared counters in Redis, approximate local limits, sliding-window counters) and what happens with clock skew.",
        problems: [
          [359, "Logger Rate Limiter", "E"],
          [362, "Design Hit Counter", "M"],
          [622, "Design Circular Queue", "M"],
          [641, "Design Circular Deque", "M"],
          [null, "Token-Bucket Rate Limiter", "M"]
        ],
        tools: ["Circular Buffer", "Deque", "Hash Map", "Queue"],
        blocks: ["Negative Modulo", "Half-Open vs Closed Ranges", "Space-Time Trade-off"]
      }],
      ["Stream Summary Structures", "Maintain a running answer (average, median, k-th largest, latest price, merged ranges) as each element arrives.", {
        tier: "google",
        recognize: "'Data stream', 'called many times', updates interleaved with queries, or corrections to earlier values.",
        idea: "Pick the structure whose invariant is the answer: a window deque plus running sum for averages, two heaps for the median, a size-k min-heap for k-th largest, a heap plus 'latest' map with lazy deletion for corrected prices, an ordered map for disjoint intervals.",
        template: `import heapq
from collections import deque

class MovingAverage:
    def __init__(self, size):
        self.size, self.window, self.total = size, deque(), 0
    def next(self, val):
        self.window.append(val)
        self.total += val
        if len(self.window) > self.size:
            self.total -= self.window.popleft()
        return self.total / len(self.window)

class KthLargest:
    def __init__(self, k, nums):
        self.k, self.heap = k, []
        for x in nums:
            self.add(x)
    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]

class StockPrice:                    # corrections + lazy deletion
    def __init__(self):
        self.price, self.latest = {}, 0
        self.max_heap, self.min_heap = [], []
    def update(self, t, p):
        self.price[t] = p
        self.latest = max(self.latest, t)
        heapq.heappush(self.max_heap, (-p, t))
        heapq.heappush(self.min_heap, (p, t))
    def maximum(self):
        while -self.max_heap[0][0] != self.price[self.max_heap[0][1]]:
            heapq.heappop(self.max_heap)          # stale entry
        return -self.max_heap[0][0]`,
        pitfalls: "Lazy deletion must check staleness every time you read the top. Integer division on averages in some languages.",
        staff: "Ask how many queries vs updates there are and pick the structure to fit; mention approximate quantiles (t-digest) when exact medians over huge streams are too costly.",
        problems: [
          [346, "Moving Average from Data Stream", "E"],
          [703, "Kth Largest Element in a Stream", "E"],
          [2034, "Stock Price Fluctuation", "M"],
          [295, "Find Median from Data Stream", "H"],
          [352, "Data Stream as Disjoint Intervals", "H"]
        ],
        tools: ["Binary Heap", "heapq", "Deque", "Hash Map", "Ordered Map / Sorted List"],
        blocks: ["Running Best-So-Far", "Accumulators", "Amortized Analysis", "Loop Invariants"]
      }],
      ["Min & Max Stack", "Pair each stack entry with the min (or max) so far, so the extreme is always O(1) at the top.", {
        tier: "core",
        recognize: "Stack operations plus getMin/getMax in O(1), or popping by frequency.",
        idea: "Push (value, min(value, current_min)). For popMax in a max stack, combine a stack with a heap or sorted structure and lazy-delete. For a frequency stack, keep one stack per frequency.",
        template: `class MinStack:
    def __init__(self):
        self.stack = []                 # (value, min so far)
    def push(self, val):
        current = self.stack[-1][1] if self.stack else val
        self.stack.append((val, min(val, current)))
    def pop(self):
        self.stack.pop()
    def top(self):
        return self.stack[-1][0]
    def get_min(self):
        return self.stack[-1][1]

class FreqStack:
    def __init__(self):
        self.freq, self.groups, self.max_freq = {}, {}, 0
    def push(self, x):
        f = self.freq[x] = self.freq.get(x, 0) + 1
        self.groups.setdefault(f, []).append(x)
        self.max_freq = max(self.max_freq, f)
    def pop(self):
        x = self.groups[self.max_freq].pop()
        self.freq[x] -= 1
        if not self.groups[self.max_freq]:
            self.max_freq -= 1
        return x`,
        pitfalls: "Keeping one global min breaks after you pop it. Max Stack's popMax needs a structure that can remove from the middle.",
        staff: "Mention the same 'carry the aggregate with each entry' trick builds a min-queue from two min-stacks.",
        problems: [
          [155, "Min Stack", "M"],
          [716, "Max Stack", "H"],
          [895, "Maximum Frequency Stack", "H"]
        ],
        tools: ["Stack", "Binary Heap", "Hash Map"],
        blocks: ["Running Best-So-Far", "Tuple Comparison", "Loop Invariants"]
      }],
      ["Trie-Based File System & Router", "Store paths segment by segment in a trie so create, lookup, list and wildcard matching follow the path.", {
        tier: "google",
        recognize: "File paths, URL routes with parameters or wildcards, hierarchical keys, or prefix-based autocomplete with ranking.",
        idea: "Split on '/' and walk one node per segment. For routing, each node has exact children plus optional ':param' and '*' children; try exact first, then parameter, then wildcard, backtracking on failure, and return the captured params.",
        template: `class RouteNode:
    def __init__(self):
        self.children = {}      # exact segment -> node
        self.param = None       # (name, node) for ':id'
        self.wildcard = None    # handler for '*'
        self.handler = None

class Router:
    def __init__(self):
        self.root = RouteNode()

    def add(self, path, handler):
        node = self.root
        for seg in path.strip("/").split("/"):
            if seg == "*":
                node.wildcard = handler
                return
            if seg.startswith(":"):
                if node.param is None:
                    node.param = (seg[1:], RouteNode())
                node = node.param[1]
            else:
                node = node.children.setdefault(seg, RouteNode())
        node.handler = handler

    def match(self, path):
        segs = path.strip("/").split("/")
        def walk(node, i, params):
            if i == len(segs):
                return (node.handler, params) if node.handler else None
            child = node.children.get(segs[i])
            if child:
                found = walk(child, i + 1, params)
                if found:
                    return found
            if node.param:
                name, child = node.param
                found = walk(child, i + 1, {**params, name: segs[i]})
                if found:
                    return found
            if node.wildcard:
                return node.wildcard, params
            return None
        return walk(self.root, 0, {})`,
        pitfalls: "Empty segments from leading or trailing slashes. Ambiguous routes: define precedence (exact over param over wildcard) out loud before coding.",
        staff: "Clarify requirements first (conflicts, trailing slashes, query strings), then discuss matching cost per request and how real routers compile routes into a radix tree.",
        problems: [
          [null, "HTTP Route Matching for a Web Framework", "M", "G"],
          [1166, "Design File System", "M"],
          [588, "Design In-Memory File System", "H"],
          [642, "Design Search Autocomplete System", "H"]
        ],
        tools: ["Trie", "Hash Map", "Depth-First Search"],
        blocks: ["Backtracking", "Helper Functions & Closures", "Guard Clauses & Early Return", "Base Case"]
      }],
      ["Concurrency Primitives", "Order threads with locks, condition variables and semaphores, and make shared structures safe.", {
        tier: "stretch",
        recognize: "'Print in order across threads', a bounded blocking queue, producer-consumer, or a multithreaded crawler.",
        idea: "Protect shared state with one lock; wait on a condition variable in a while loop until your predicate holds; notify after changing state. Semaphores count available slots or permits.",
        template: `import threading
from collections import deque

class BoundedBlockingQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.items = deque()
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)
        self.not_empty = threading.Condition(self.lock)

    def enqueue(self, item):
        with self.not_full:
            while len(self.items) >= self.capacity:
                self.not_full.wait()
            self.items.append(item)
            self.not_empty.notify()

    def dequeue(self):
        with self.not_empty:
            while not self.items:
                self.not_empty.wait()
            item = self.items.popleft()
            self.not_full.notify()
            return item

    def size(self):
        with self.lock:
            return len(self.items)`,
        pitfalls: "Waiting with 'if' instead of 'while' breaks on spurious wakeups. Holding a lock while doing slow I/O kills throughput; lock order mismatches cause deadlock.",
        staff: "Discuss lock granularity, lock-free alternatives, back-pressure, and how a crawler bounds concurrency and dedupes URLs across workers.",
        problems: [
          [1114, "Print in Order", "E"],
          [1115, "Print FooBar Alternately", "M"],
          [1188, "Design Bounded Blocking Queue", "M"],
          [1117, "Building H2O", "M"],
          [1226, "The Dining Philosophers", "M"],
          [1242, "Web Crawler Multithreaded", "M"]
        ],
        tools: ["Queue", "Deque", "Hash Set"],
        blocks: ["While Loops", "Pre & Postconditions", "Loop Invariants"]
      }]
    ]
  });

  PATTERNS.push({
    name: "Staff Scale Follow-ups",
    layer: "Patterns",
    blurb: "The 'what if it doesn't fit in memory, arrives as a stream, or spans machines' turn that L6 rounds expect you to volunteer.",
    items: [
      ["External Sort & Data Larger Than RAM", "Process data in memory-sized chunks: sort or aggregate each chunk to disk, then k-way merge the sorted runs.", {
        tier: "stretch",
        recognize: "Follow-ups like 'the file is 100 GB and you have 1 GB of RAM', 'top-k over logs that don't fit', 'dedupe billions of items'.",
        idea: "Two passes over disk: (1) read chunks, sort or hash-partition each, write runs; (2) merge runs with a min-heap reading one buffer per run. For counting, hash-partition by key so each partition fits, then count each partition independently.",
        template: `import heapq

def external_sort(read_chunks, write_run, open_runs, out):
    # pass 1: sorted runs that each fit in memory
    for i, chunk in enumerate(read_chunks()):
        write_run(i, sorted(chunk))
    # pass 2: k-way merge of the runs
    for value in heapq.merge(*open_runs()):
        out.write(value)

def top_k_ips(lines, k, partitions, open_partition):
    # pass 1: hash-partition so every copy of an IP lands in one file
    for ip in lines:
        partitions[hash(ip) % len(partitions)].write(ip)
    # pass 2: count each partition in memory, keep a global top-k heap
    best = []
    for p in range(len(partitions)):
        counts = {}
        for ip in open_partition(p):
            counts[ip] = counts.get(ip, 0) + 1
        for ip, c in counts.items():
            heapq.heappush(best, (c, ip))
            if len(best) > k:
                heapq.heappop(best)
    return sorted(best, reverse=True)`,
        pitfalls: "Proposing 'just use Spark' without the mechanism. Forgetting that a skewed key can make one partition too big; say you'd re-partition it with a second hash.",
        staff: "Quantify: number of passes, I/O volume, memory per merge buffer, and how the same plan parallelizes across machines.",
        problems: [
          [null, "Top K Frequent IPs in a File Larger Than RAM", "H", "G"],
          [null, "Sort a 100 GB File With 1 GB of Memory", "M"],
          [null, "Dedupe Billions of URLs", "M"],
          [23, "Merge k Sorted Lists", "H"]
        ],
        tools: ["Binary Heap", "heapq", "Merge Procedure", "Hash Map"],
        blocks: ["Divide & Conquer", "Space-Time Trade-off", "Big-O Time & Space"]
      }],
      ["One-Pass Streaming Algorithms", "Answer with O(1) or O(k) memory in a single pass: Boyer-Moore majority, Misra-Gries heavy hitters, reservoir sampling.", {
        tier: "stretch",
        recognize: "'You can only read the input once', 'the stream is unbounded', or majority and frequent elements with tiny memory.",
        idea: "Boyer-Moore pairs off different values; a true majority survives. Misra-Gries keeps k - 1 counters and decrements all when a new value has no slot, guaranteeing every item above n/k survives (verify in a second pass if allowed).",
        template: `def majority(stream):
    candidate, count = None, 0
    for x in stream:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate

def heavy_hitters(stream, k):
    counters = {}
    for x in stream:
        if x in counters:
            counters[x] += 1
        elif len(counters) < k - 1:
            counters[x] = 1
        else:
            for key in list(counters):
                counters[key] -= 1
                if counters[key] == 0:
                    del counters[key]
    return counters        # superset of items with count > n / k`,
        pitfalls: "These return candidates, not proven answers; say whether a verification pass is possible. Deleting from a dict while iterating it directly raises an error.",
        staff: "Explain the error bound and how summaries from several machines merge, which is what makes them useful at scale.",
        problems: [
          [169, "Majority Element", "E"],
          [229, "Majority Element II", "M"],
          [382, "Linked List Random Node", "M"],
          [null, "Heavy Hitters in a Click Stream", "M"],
          [null, "Median of a Stream Spread Across Machines", "H"]
        ],
        tools: ["Hash Map", "Counter / Frequency Map"],
        blocks: ["Single Pass", "Loop Invariants", "Mutation During Iteration", "Randomization"]
      }],
      ["Probabilistic Sketches", "Bloom filters, Count-Min sketches and HyperLogLog trade a small, bounded error for tiny fixed memory.", {
        tier: "awareness",
        recognize: "'Have we seen this before' over billions of keys, approximate frequencies, or approximate distinct counts where exact sets won't fit.",
        idea: "Bloom filter: k hashes set k bits; any unset bit means 'definitely not seen', all set means 'probably seen'. Count-Min: a d x w counter grid, take the min across rows. HyperLogLog: track the max run of leading zeros per bucket to estimate cardinality.",
        template: `import hashlib

class BloomFilter:
    def __init__(self, bits, hashes):
        self.size, self.k = bits, hashes
        self.bitmap = bytearray(bits // 8 + 1)

    def _positions(self, item):
        for seed in range(self.k):
            digest = hashlib.sha256(f"{seed}:{item}".encode()).digest()
            yield int.from_bytes(digest[:8], "big") % self.size

    def add(self, item):
        for p in self._positions(item):
            self.bitmap[p // 8] |= 1 << (p % 8)

    def might_contain(self, item):
        return all(self.bitmap[p // 8] >> (p % 8) & 1
                   for p in self._positions(item))`,
        pitfalls: "Bloom filters have false positives but never false negatives, and they can't delete (use a counting Bloom filter). Don't claim exactness.",
        staff: "Name where they live: Bigtable/LSM reads skip files with Bloom filters; crawlers dedupe URLs; analytics count distinct users with HyperLogLog.",
        problems: [
          [null, "Has This URL Been Crawled? (Bloom Filter)", "M"],
          [null, "Approximate Count of Distinct Users (HyperLogLog)", "M"]
        ],
        tools: ["Bitset / Bitmask", "Hash Map"],
        blocks: ["Randomization", "Space-Time Trade-off", "Bit Loop"]
      }],
      ["Sharding an Algorithm Across Machines", "Split the input by key or region, solve each shard locally, then combine the partial answers in a reduce step.", {
        tier: "stretch",
        recognize: "'The grid or graph doesn't fit on one machine', 'logs are spread over 1,000 servers', or any follow-up about 10x or 1000x scale.",
        idea: "Pick a partition key so most work stays local. Each shard returns a small summary (counts, local top-k, boundary labels), and a combine step merges them. For islands, label components per tile, then union-find the labels that touch across tile borders.",
        template: `def islands_on_tiles(tiles, solve_tile, border_pairs):
    # map: each tile labels its own islands and reports border cells
    labels = {}                          # (tile, local_id) -> global id
    for t in tiles:
        for local_id in solve_tile(t):
            labels[(t, local_id)] = len(labels)
    parent = list(range(len(labels)))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    # reduce: merge islands that touch across tile borders
    for a, b in border_pairs():          # pairs of (tile, local_id)
        ra, rb = find(labels[a]), find(labels[b])
        if ra != rb:
            parent[ra] = rb
    return len({find(x) for x in range(len(labels))})`,
        pitfalls: "Ignoring skew (one hot key) and ignoring the cross-shard edges. Don't jump to naming a framework; describe map, shuffle and reduce in your own algorithm's terms.",
        staff: "This is the core L6 follow-up: state the per-shard work, the size of what crosses the network, and how failures and retries are handled.",
        problems: [
          [null, "Number of Islands on a Grid Too Big for One Machine", "H", "G"],
          [null, "Connected Components on a Graph Spanning Machines", "H", "G"],
          [null, "Word Count Over Sharded Logs (Map-Reduce)", "M"]
        ],
        tools: ["Union-Find", "Hash Map", "Matrix / Grid"],
        blocks: ["Divide & Conquer", "Reduction / Transform", "Big-O Time & Space"]
      }],
      ["Offline Query Processing", "When all queries are known up front, sort queries and data together so each is answered with incremental work.", {
        tier: "stretch",
        recognize: "Many queries each with a threshold ('edges below limit', 'intervals containing point', 'values at most m'), and no need to answer them in arrival order.",
        idea: "Sort queries by their threshold and sort the data the same way. Sweep once, adding data as the threshold grows (union edges, push intervals, insert into a trie), and answer each query at its point in the sweep. Remember original indices.",
        template: `def limited_paths(n, edges, queries):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    edges.sort(key=lambda e: e[2])
    order = sorted(range(len(queries)), key=lambda i: queries[i][2])
    answers = [False] * len(queries)
    j = 0
    for i in order:
        u, v, limit = queries[i]
        while j < len(edges) and edges[j][2] < limit:
            a, b, _ = edges[j]
            parent[find(a)] = find(b)
            j += 1
        answers[i] = find(u) == find(v)
    return answers`,
        pitfalls: "Losing the original query order. Strict vs non-strict threshold comparisons.",
        staff: "Contrast offline batch processing with an online API that must answer immediately, and say what extra structure (persistent DSU, segment tree) the online version needs.",
        problems: [
          [1697, "Checking Existence of Edge Length Limited Paths", "H"],
          [1851, "Minimum Interval to Include Each Query", "H"],
          [1707, "Maximum XOR With an Element From Array", "H"],
          [2503, "Maximum Number of Points From Grid Queries", "H"]
        ],
        tools: ["Union-Find", "Comparison Sort & Comparators", "Binary Heap", "Trie"],
        blocks: ["Reduction / Transform", "Two-Index While Loop", "Monotonicity"]
      }],
      ["Divide & Conquer Recursion", "Split the input, solve the halves recursively, and combine; the combine step is where the insight lives.", {
        tier: "core",
        recognize: "The answer for the whole follows from answers for halves plus a cross term: sorting, power, expression trees, majority, closest pair.",
        idea: "Write the recurrence first: T(n) = a T(n / b) + combine cost. Merge sort is 2 T(n/2) + O(n) = O(n log n); fast power is T(n/2) + O(1) = O(log n). The same split-solve-combine shape is how work shards across machines.",
        template: `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]

def ways_to_compute(expr):
    if expr.isdigit():
        return [int(expr)]
    results = []
    for i, ch in enumerate(expr):
        if ch in "+-*":
            for a in ways_to_compute(expr[:i]):
                for b in ways_to_compute(expr[i + 1:]):
                    results.append(a + b if ch == "+" else a - b if ch == "-" else a * b)
    return results`,
        pitfalls: "Slicing copies cost O(n) per level; pass indices when it matters. Missing memoization when subproblems repeat turns D&C into DP.",
        staff: "Use the recurrence to justify complexity out loud, and point out the combine step is exactly what a reduce phase does at scale.",
        problems: [
          [169, "Majority Element", "E"],
          [50, "Pow(x, n)", "M"],
          [912, "Sort an Array", "M"],
          [241, "Different Ways to Add Parentheses", "M"],
          [23, "Merge k Sorted Lists", "H"]
        ],
        tools: ["Merge Procedure", "Memoization", "Array & Dynamic Array"],
        blocks: ["Divide & Conquer", "Base Case", "Recursive Case", "Recurrences & Master Theorem"]
      }]
    ]
  });

  // ---------------------------------------------------------------- Tools layer
  var TOOLS = [
    {
      name: "Core Data Structures",
      blurb: "The containers almost every solution is built from. Know each operation's cost cold.",
      items: [
        ["Array & Dynamic Array", "Contiguous, index-addressable storage. O(1) access and amortised O(1) append; insert or delete in the middle is O(n).", { idea: "Python list: index, append, pop() are O(1); insert(0, x), pop(0), x in list and slicing are O(n). Preallocate with [0] * n." }],
        ["String & String Builder", "Strings are immutable, so repeated += can be O(n^2). Collect parts in a list and join once.", { idea: "''.join(parts) is O(total length). s[i:j] copies. ord/chr map characters to ints; a 26-slot array beats a dict for lowercase-only counts." }],
        ["Hash Map", "Key to value lookup, insert and delete in O(1) on average. The default tool for turning O(n^2) scans into O(n).", { idea: "dict: get, set, in, del are O(1) average and O(n) worst case. Keys must be hashable. Iteration follows insertion order in Python 3.7+." }],
        ["Hash Set", "Membership checks in O(1) on average. Use it for seen-before checks, de-duplication and visited sets.", { idea: "set: add, discard, in are O(1). Set algebra (&, |, -) costs the size of the operands. frozenset can be a key." }],
        ["Counter / Frequency Map", "A map from item to count. The basis of anagram, majority, top-K and sliding-window validity checks.", { idea: "Counter(iterable) is O(n); most_common(k) is O(n log k). Compare two counters with ==; a fixed 26-int array is faster for letters." }],
        ["Linked List", "Nodes joined by next (and prev) pointers. O(1) splice once you hold the node, O(n) to find it.", { idea: "A dummy head removes head special cases. A doubly linked list plus a hash map gives O(1) move-to-front, the core of an LRU cache." }],
        ["Stack", "Last in, first out. Models nesting, undo, DFS and anything waiting on its next greater or smaller element.", { idea: "Use a Python list: append and pop are O(1). Peek with stack[-1] after checking it isn't empty." }],
        ["Queue", "First in, first out. Processes items in arrival order; the engine of BFS.", { idea: "Use collections.deque: append and popleft are O(1). list.pop(0) is O(n) and quietly makes BFS quadratic." }],
        ["Deque", "A double-ended queue with O(1) push and pop at both ends. Powers monotonic queues and 0-1 BFS.", { idea: "deque(maxlen=k) gives a fixed-size rolling buffer. Indexing the middle is O(n)." }],
        ["Binary Heap", "A complete tree kept in an array whose root is always the min (or max). O(log n) push and pop, O(1) peek.", { idea: "heapify is O(n). For a max-heap, push negated keys. Push tuples (priority, tiebreak, item) so items never need to compare." }],
        ["Binary Tree", "Each node has up to two children. Most tree problems solve the left subtree, solve the right, then combine.", { idea: "Height h ranges from log n (balanced) to n (a chain), so recursion depth and stack space are O(h)." }],
        ["Binary Search Tree", "A binary tree where left < node < right. In-order traversal gives sorted order; search is O(h).", { idea: "Pass (low, high) bounds down to validate it. Successor is the leftmost node of the right subtree, or the nearest ancestor you went left from." }],
        ["Graph Representations", "Adjacency list, adjacency matrix, edge list or an implicit graph (grid cells, puzzle states) generated on the fly.", { idea: "Adjacency list: O(V + E) space, the default. Matrix: O(V^2), fine for dense or small graphs. Edge list: what Kruskal and union-find want." }],
        ["Matrix / Grid", "A 2D array that is often an implicit graph: each cell is a node and its 4 or 8 neighbours are edges.", { idea: "Build it with [[0] * cols for _ in range(rows)]. Index as grid[r][c] and check 0 <= r < rows before reading." }]
      ]
    },
    {
      name: "Advanced Structures",
      blurb: "Specialised structures that turn a hard problem into a standard one.",
      items: [
        ["Ordered Map / Sorted List", "Keys kept in sorted order: floor, ceiling, rank and range queries in O(log n). Java TreeMap, C++ map.", { idea: "Python has none built in: use sortedcontainers.SortedList, or bisect on a plain list (O(n) insert) when n is small." }],
        ["Trie", "A tree keyed by characters, so shared prefixes share a path. Insert and lookup are O(word length).", { idea: "Each node holds children (a dict or a 26-slot array) and an end flag. Store the whole word at the end node to rebuild results cheaply." }],
        ["Union-Find", "Disjoint sets with near-O(1) union and find. Answers 'are these connected?' while edges keep arriving.", { idea: "Path compression plus union by rank or size gives inverse-Ackermann amortised time. Track a component count; a union that returns False means a cycle." }],
        ["Segment Tree", "A tree over array ranges with O(log n) range queries and point updates. Lazy propagation adds range updates.", { idea: "Use a 4n array, or 2n for the iterative bottom-up version. It works for any associative operation: sum, min, max, gcd." }],
        ["Fenwick Tree", "A binary indexed tree for prefix sums with O(log n) point updates and queries, in about ten lines of code.", { idea: "It is 1-indexed. update: i += i & -i. query: i -= i & -i. A range sum is prefix(r) - prefix(l - 1)." }],
        ["Sparse Table", "O(1) range min or max over a static array after O(n log n) preprocessing.", { idea: "table[k][i] = min of the 2^k elements starting at i. A query covers [l, r] with two overlapping power-of-two blocks." }],
        ["LinkedHashMap / OrderedDict", "A hash map that remembers order, with O(1) move-to-end. LRU in a few lines.", { idea: "OrderedDict.move_to_end(key) and popitem(last=False). In an interview, also be ready to build it by hand from a dict plus a doubly linked list." }],
        ["Circular Buffer", "A fixed-size array with head and tail indices that wrap with modulo. O(1) push and pop, no reallocation.", { idea: "Keep a count, or one empty slot, to tell full from empty. It underlies hit counters and rate limiters with fixed windows." }],
        ["Bitset / Bitmask", "An integer used as a set of small items: bit i means item i is present. O(1) union, intersection and membership.", { idea: "Test: mask >> i & 1. Add: mask | 1 << i. Remove: mask & ~(1 << i). Python ints are unbounded, so masks never overflow." }]
      ]
    },
    {
      name: "Algorithms as Tools",
      blurb: "Standard procedures you call inside a bigger solution, not solutions on their own.",
      items: [
        ["Comparison Sort & Comparators", "Sorting costs O(n log n) and often makes the rest of a problem linear. The key or comparator is where the logic lives.", { idea: "sorted(xs, key=lambda x: (x[0], -x[1])). For a pairwise comparator use functools.cmp_to_key. Python's Timsort is stable." }],
        ["Counting / Bucket / Radix Sort", "Linear-time sorts when keys are small integers or bounded. Bucket by frequency gives O(n) top-K.", { idea: "Counting sort is O(n + k). Bucket sort by frequency: buckets[count].append(x), then read from the highest bucket down." }],
        ["Binary Search", "Halve a monotonic search space each step. Works on sorted arrays and on any yes/no predicate over answers.", { idea: "Pick one convention (half-open lo < hi with hi = mid) and stick to it. The loop invariant decides which side keeps mid." }],
        ["Quickselect", "Find the k-th smallest in O(n) average time by partitioning and recursing into one side only.", { idea: "Pick a random pivot to avoid the O(n^2) worst case. Median of medians guarantees O(n) but is rarely expected." }],
        ["Breadth-First Search", "Explore in layers from one or more sources. Gives shortest paths in unweighted graphs.", { idea: "Mark nodes visited when you enqueue them, not when you dequeue, or duplicates flood the queue. Process level by level with len(queue)." }],
        ["Depth-First Search", "Go deep along one path before backtracking. Used for components, cycles, topological order and tree recursion.", { idea: "Recursive DFS is O(V + E) but deep inputs overflow the stack; know the iterative version with an explicit stack." }],
        ["Memoization", "Cache a pure function's results by its arguments, so each subproblem is solved once. Top-down DP.", { idea: "@functools.cache, or a dict keyed by a tuple of the state. Total time is states x work per state." }],
        ["Merge Procedure", "Merge two sorted sequences in linear time with two pointers. The core of merge sort, k-way merge and inversion counts.", { idea: "Compare heads, take the smaller, advance that pointer, then append the leftovers. Use <= to keep the merge stable." }],
        ["Partition Procedure", "Rearrange around a pivot in place (Lomuto, Hoare or three-way Dutch flag). The core of quicksort and quickselect.", { idea: "Three-way partition (<, =, >) handles many duplicate keys and solves Sort Colors in one pass." }]
      ]
    },
    {
      name: "Python Toolkit",
      blurb: "The standard-library pieces that make interview code short and correct.",
      items: [
        ["collections: deque, Counter, defaultdict", "deque for queues, Counter for frequencies and defaultdict(list) for adjacency lists, with no missing-key checks.", { idea: "defaultdict(int) counts; defaultdict(list) groups. Reading a missing key inserts it, so test membership with 'in' first when that matters." }],
        ["heapq", "A min-heap on a plain list: heappush, heappop, heapify, nlargest, nsmallest and heappushpop.", { idea: "Negate values for a max-heap. Put a counter in tuples as a tiebreaker. heapq.merge lazily merges sorted iterables." }],
        ["bisect module", "Binary search on a sorted list: bisect_left and bisect_right return insertion points; insort inserts.", { idea: "bisect_left gives the first index with value >= x; bisect_right gives the first with value > x. Python 3.10+ accepts key=." }],
        ["functools.cache", "One-line memoisation for recursive DP. lru_cache(None) is the older spelling.", { idea: "Arguments must be hashable, so pass tuples, not lists. Deep recursion can still hit the recursion limit." }],
        ["itertools", "accumulate, combinations, permutations, product, groupby, pairwise and chain for brute-force checks and prefix sums.", { idea: "accumulate(xs, initial=0) builds prefix sums. groupby only groups consecutive equal keys, so sort first." }],
        ["sortedcontainers", "SortedList, SortedDict and SortedSet with O(log n) add, remove and index. Python's stand-in for TreeMap.", { idea: "Not always available in an interview: ask first, and be ready to fall back to bisect plus a list, or a heap with lazy deletion." }],
        ["Recursion Limit & Iterative Rewrites", "CPython stops at about 1000 frames by default. Deep DFS on a 10^5-node chain will crash.", { idea: "sys.setrecursionlimit only raises the ceiling and can still crash the interpreter. Converting to an explicit stack is the robust fix." }]
      ]
    }
  ];

  // ------------------------------------------------------ Fundamental Blocks layer
  var BLOCKS = [
    {
      name: "Control Flow",
      blurb: "The statements every algorithm is made of.",
      items: [
        ["Sequence", "Statements run top to bottom. Most bugs are ordering bugs: updating state before it is read, or after."],
        ["If / Else Branching", "Choose a path from a condition. Order checks from most to least specific, and make the else case explicit."],
        ["Guard Clauses & Early Return", "Handle empty, null or trivial inputs at the top and return early, so the main logic stays flat and readable."],
        ["For Loops", "Iterate a known range or collection. Use enumerate when you need the index, zip for parallel lists, range(n - 1, -1, -1) to count down."],
        ["While Loops", "Iterate until a condition fails. Every while loop needs a variable that provably moves toward exit, or it never ends."],
        ["Nested Loops", "A loop inside a loop multiplies cost: two levels over n items is O(n^2). The usual first brute force to beat."],
        ["Break & Continue", "break leaves the loop; continue skips to the next iteration. Python's for-else runs the else only if no break happened."],
        ["Loop-and-a-Half", "Exit from the middle of a loop body (while True with a break) when the stop test needs work done first."]
      ]
    },
    {
      name: "State & Variables",
      blurb: "What you carry from one step to the next.",
      items: [
        ["Accumulators", "A running sum, count, product, min or max updated each step. Start it at the identity: 0, 1, inf or -inf."],
        ["Boolean Flags", "A true or false marker for 'found', 'swapped' or 'valid'. Prefer returning early when a flag only means stop."],
        ["Running Best-So-Far", "Track the best answer seen and the best state to extend: min price so far, max ending here. The heart of Kadane and stock problems."],
        ["Swap", "Exchange two values: a, b = b, a in Python. The basis of in-place partition, reversal and cyclic sort."],
        ["Sentinels", "A fake boundary value, like inf, -1, a dummy head or padding, that removes edge-case checks from the loop."],
        ["Visited Markers", "Record what you've processed so graph search ends: a set, a boolean array, or overwriting grid cells in place."]
      ]
    },
    {
      name: "Iteration Shapes",
      blurb: "The common ways a loop walks over the input.",
      items: [
        ["Single Pass", "Touch each element once, keeping just enough state to answer. The O(n) target for most array problems."],
        ["Two Pass", "One pass to precompute (counts, prefix values, the total), a second to answer. Still O(n), and often much simpler."],
        ["Reverse Scan", "Iterate from the end, to build suffix information or to fill an array in place without overwriting unread values."],
        ["Pair Loops (i < j)", "Consider each unordered pair once with j starting at i + 1: n(n - 1) / 2 pairs. The brute force behind two-sum-style problems."],
        ["Direction Arrays", "Loop over neighbours with dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)] instead of four copied blocks of code."],
        ["Digit Loop", "Peel digits with d = n % 10 and n //= 10, or build a number with n = n * 10 + d. Watch for negatives and overflow."],
        ["Bit Loop", "Walk bits with n & 1 and n >>= 1, or clear the lowest set bit with n &= n - 1 so the loop runs once per set bit."],
        ["Two-Index While Loop", "Advance two indices under your control, as in merging or two pointers. The loop ends when either runs out; handle the leftovers."]
      ]
    },
    {
      name: "Recursion",
      blurb: "Solving a problem in terms of smaller copies of itself.",
      items: [
        ["Base Case", "The smallest input you answer directly. Missing or wrong base cases cause infinite recursion or off-by-one answers."],
        ["Recursive Case", "Reduce the problem to smaller subproblems, trust the recursive calls (the induction step), and combine their results."],
        ["Call Stack & Depth", "Each call adds a stack frame. Depth equals the longest chain of calls: tree height, path length or recursion level."],
        ["Return Value vs Accumulator Parameter", "Either return results up the stack (bottom-up), or pass partial state down as parameters (top-down). Pick one per function."],
        ["Helper Functions & Closures", "An inner function that captures outer variables keeps signatures small. Rebinding an outer variable needs nonlocal."],
        ["Recursion to Explicit Stack", "Replace the call stack with your own list of pending frames, to avoid recursion limits or to pause and resume work, as an iterator does."]
      ]
    },
    {
      name: "Boundaries & Arithmetic",
      blurb: "Where off-by-one and overflow bugs come from.",
      items: [
        ["Zero-Based Indexing", "The first element is index 0 and the last is n - 1. Converting from 1-based problem statements is a classic bug source."],
        ["Half-Open vs Closed Ranges", "[lo, hi) excludes hi and has length hi - lo; [lo, hi] includes it. Pick one per function and make every bound agree."],
        ["Off-by-One Errors", "Loops that run one time too many or too few. Check them by hand on inputs of size 0, 1 and 2."],
        ["Bounds Checks", "Validate an index before you read it, especially for neighbours, i + 1 lookahead and s[i - 1] lookbehind."],
        ["Integer Division, Floor & Ceil", "a // b floors, even for negatives. Ceil for positive integers is (a + b - 1) // b or -(-a // b), with no floats needed."],
        ["Negative Modulo", "Python's % has the sign of the divisor, so -1 % 5 == 4. C++ and Java give -1. Normalise with (x % m + m) % m."],
        ["Integer Overflow & Safe Midpoint", "Python ints don't overflow, but Java and C++ do: use mid = lo + (hi - lo) / 2 and mention 64-bit sums."],
        ["Floating-Point Precision", "Floats can't represent most decimals exactly. Compare with a tolerance, or keep exact integers or fractions (slopes as reduced (dy, dx) pairs)."]
      ]
    },
    {
      name: "Data Semantics",
      blurb: "How values are shared, copied and changed.",
      items: [
        ["Reference vs Copy", "Assigning a list copies the reference, not the data. Use list(x), x[:] or copy.deepcopy when you need an independent copy."],
        ["Aliasing", "[[0] * n] * m makes m references to one row, so writing one cell changes every row. Build grids with a comprehension."],
        ["Mutation During Iteration", "Changing a dict or set while looping over it raises an error or skips items. Iterate over a snapshot instead."],
        ["Copying the Path in Backtracking", "Append path[:] (a copy) to results, not path itself, or every saved result ends up as the same empty list."],
        ["Hashable Keys", "Dict keys and set members must be immutable: use tuples, strings or frozensets, never lists. Common for memo keys."]
      ]
    },
    {
      name: "Ordering",
      blurb: "Deciding what comes first, and what happens on ties.",
      items: [
        ["Comparators", "A function that says which of two items comes first. In Python, prefer a sort key; use cmp_to_key only for pairwise rules."],
        ["Stable Sort", "Equal items keep their original relative order. That lets you sort by a secondary key first, then by the primary key."],
        ["Tie-Breaking", "Decide explicitly what happens when keys are equal, e.g. end events before start events in a sweep. Many wrong answers hide here."],
        ["Tuple Comparison", "Tuples compare field by field, so (priority, index) sorts and heaps cleanly without a custom class."]
      ]
    },
    {
      name: "Complexity",
      blurb: "Predicting cost before you write the code.",
      items: [
        ["Big-O Time & Space", "How cost grows with input size. Count the dominant work, and state time and space for every solution you propose."],
        ["Recursion Stack Space", "Recursive solutions use O(depth) hidden space. A 'constant space' recursive tree solution is really O(h)."],
        ["Amortized Analysis", "Average cost per operation over a sequence. Dynamic array growth, monotonic stacks and union-find are cheap amortised."],
        ["Recurrences & Master Theorem", "T(n) = aT(n/b) + f(n) gives the cost of divide and conquer: merge sort is O(n log n), binary search O(log n)."],
        ["Constraints to Complexity", "Read the target from n: about 20 means O(2^n), 500 means O(n^3), 10^4 means O(n^2), 10^5 to 10^6 means O(n log n) or O(n)."]
      ]
    },
    {
      name: "Correctness",
      blurb: "How to argue your code is right before you run it.",
      items: [
        ["Loop Invariants", "A statement true before and after every iteration. Use it to justify pointer moves and binary search bounds out loud."],
        ["Induction", "Prove a base case, then show that correctness for smaller inputs implies it for the next. Recursion and DP are induction in code."],
        ["Monotonicity", "As one variable grows, a property only moves one way. It is what makes binary search, two pointers and sliding windows valid."],
        ["Exchange Argument", "Show that swapping any optimal solution's choice for the greedy choice is no worse. The standard proof that a greedy works."],
        ["Pre & Postconditions", "State what must be true on entry and what the function guarantees on exit. Clarifying them up front is good interview hygiene."]
      ]
    },
    {
      name: "Paradigms",
      blurb: "The high-level strategies every pattern is an instance of.",
      items: [
        ["Brute Force & Enumeration", "Try every candidate. Always state it first with its complexity: it proves you understand the problem and anchors the optimisation."],
        ["Reduction / Transform", "Recast the problem as a known one: a grid as a graph, intervals as events, 'exactly K' as two 'at most K' calls."],
        ["Precomputation", "Pay once up front (prefix sums, sorting, an index map) so each later query is cheap."],
        ["Space-Time Trade-off", "Spend memory such as hash maps, memo tables or caches to save time, or the reverse. Name the trade explicitly."],
        ["Divide & Conquer", "Split into independent subproblems, solve each recursively, then merge: merge sort, quickselect, closest pair."],
        ["Greedy Choice", "Commit to the locally best option at each step, and never revisit it. Correct only when an exchange argument holds."],
        ["Dynamic Programming", "Overlapping subproblems with optimal substructure: define a state, a transition and a base case, then fill or memoise."],
        ["Backtracking", "Build candidates step by step: choose, explore, un-choose, and prune branches that can't succeed."],
        ["Randomization", "Use randomness for expected-time guarantees or fair sampling: random pivots, reservoir sampling, shuffling, hashing."]
      ]
    }
  ];

  // --------------------------------------------------------- Interview Craft layer
  var CRAFT = [
    {
      name: "Interview Craft",
      blurb: "How a Google L6 round is run and scored. Strong coding is assumed at this level, and the craft is what separates offers.",
      items: [
        ["Clarify and Pin Constraints", "Before coding, confirm input size, value ranges, duplicates, empty input, sortedness and the expected output format.", { idea: "Google leaves prompts ambiguous on purpose. Ask about n, value ranges, duplicates, and streaming versus in-memory input, then restate the problem in your own words." }],
        ["Hand-Made Examples and Edge Cases", "Write a small example plus the edge cases (empty, one element, all equal, negatives, maximum size) before choosing an approach.", { idea: "A good example often reveals the pattern. Keep the list in the doc and reuse it for the dry run." }],
        ["Brute Force First, With Complexity", "State the obvious solution and its cost in one or two sentences, then say why it's too slow for the constraints.", { idea: "Keep it brief: 30 to 60 seconds. It shows the baseline and makes the optimisation's value explicit." }],
        ["Present Two or More Solutions", "At staff level, lay out alternatives with time, space and simplicity trade-offs, then pick one deliberately.", { idea: "The top score is several solutions illustrated along with their drawbacks. For example: heap O(n log k) vs quickselect O(n) average vs bucket sort O(n)." }],
        ["Clean, Modular Code Without an IDE", "Write readable code in a doc: helper functions, meaningful names, no dead code, consistent style.", { idea: "You can't run code in the VIP editor or a Google Doc, so code quality and minimal bugs are graded directly. Factor out helpers like neighbors(r, c) and is_valid(state)." }],
        ["Dry-Run Testing Out Loud", "Trace your own example line by line, tracking variables, and find your own bug before the interviewer does.", { idea: "Then test the edge cases. Fix bugs calmly and explain the root cause, not just the patch." }],
        ["Complexity Proof", "State and justify time and space: say why each loop is bounded, including amortised and recursion-stack costs.", { idea: "Tie it to the constraints: 'n is 10^5, so O(n log n) is about 1.7 million operations, which is fine.'" }],
        ["Volunteer the Follow-Ups", "After a clean solve, raise the harder version yourself: 10x scale, a stream, data larger than memory, many machines, concurrency.", { idea: "Candidates who sit still after a clean solve score lower. Keep it about the algorithm (chunking, external merge, sketches, sharding by key), not just naming a framework." }],
        ["Handling Hints", "Treat a hint as information: acknowledge it, connect it to your approach and move on. A hint or two is normal at L6.", { idea: "If stuck, think out loud about what you're considering rather than going silent. Silence gets less tolerance at senior levels." }],
        ["The 45-Minute Time Budget", "About 5 minutes to clarify, 5 for the approach, 20 to code, 5 to test and 10 for follow-ups. L6 candidates who run out of time on follow-ups get downleveled.", { idea: "Pick the data structure quickly: at L6, fumbling the structure choice is itself a signal." }]
      ]
    }
  ];

  // -------------------------------------------------------- Problem flags + assembly
  var BLIND_75 = [1, 121, 217, 238, 53, 152, 153, 33, 15, 11, 371, 191, 338, 268, 190, 70, 322, 300, 1143, 139, 377, 198, 213, 91, 62, 55,
    133, 207, 417, 200, 128, 269, 261, 323, 57, 56, 435, 252, 253, 206, 141, 21, 23, 19, 143, 73, 54, 48, 79, 3, 424, 76, 242, 49, 20,
    125, 5, 647, 271, 104, 100, 226, 124, 102, 297, 572, 105, 98, 230, 235, 208, 211, 212, 347, 295];
  // Problems that candidate write-ups (2025-26 L4-L6 reports) say came up in Google loops.
  var GOOGLE_REPORTED = [56, 269, 1254, 359, 215, 380, 236, 1293, 1944, 437, 200, 139, 253, 91, 305, 281, 284, 438, 127];

  function withLayer(layer, categories) {
    return categories.map(function (cat) { cat.layer = layer; return cat; });
  }

  PATTERNS.forEach(function (cat) {
    cat.items.forEach(function (item) {
      var details = item[2];
      if (!details || !details.problems) return;
      details.problems = details.problems.map(function (p) {
        var flags = (p[3] || "").split(/\s+/).filter(Boolean);
        if (p[0] != null && GOOGLE_REPORTED.indexOf(p[0]) !== -1 && flags.indexOf("G") === -1) flags.push("G");
        if (p[0] != null && BLIND_75.indexOf(p[0]) !== -1 && flags.indexOf("B75") === -1) flags.push("B75");
        return { lc: p[0], title: p[1], diff: p[2], flags: flags };
      });
    });
  });

  window.CONCEPTS = window.CONCEPTS || [];
  window.CONCEPTS.push({
    id: "dsa",
    label: "DSA",
    title: "The {n} building blocks of a Google Staff coding round.",
    intro: "Problems map to patterns, patterns use tools, and tools are built from fundamental blocks. Work the Patterns layer as the core checklist: open a deep dive, solve its problems, and follow the chips down to the tools and blocks it relies on. G marks problems candidates report from Google loops; B75 marks the Blind 75.",
    blind75: BLIND_75,
    categories: []
      .concat(withLayer("Patterns", PATTERNS))
      .concat(withLayer("Tools", TOOLS))
      .concat(withLayer("Fundamental Blocks", BLOCKS))
      .concat(withLayer("Interview Craft", CRAFT))
  });
})();
