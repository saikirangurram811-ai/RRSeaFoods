package rr.seafoods.in.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/master")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MasterController {

    private final Map<Long, Map<String, Object>> states = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, Object>> districts = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, Object>> departments = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, Object>> orgs = new ConcurrentHashMap<>();

    private final AtomicLong stateIdSeq = new AtomicLong(1);
    private final AtomicLong districtIdSeq = new AtomicLong(1);
    private final AtomicLong deptIdSeq = new AtomicLong(1);
    private final AtomicLong orgIdSeq = new AtomicLong(1);

    public MasterController() {
        // Seed default initial master data
        seedState("Andhra Pradesh");
        seedState("Tamil Nadu");
        seedState("Kerala");
        seedState("Karnataka");

        seedDistrict("Visakhapatnam", 1L);
        seedDistrict("Kakinada", 1L);
        seedDistrict("Chennai", 2L);
        seedDistrict("Kochi", 3L);

        seedDept("Procurement & Coastal Sourcing");
        seedDept("Cold Chain & Quality Inspection");
        seedDept("Logistics & Express Delivery");
        seedDept("B2B Wholesale Operations");

        seedOrg("RR Sea Foods Coastal Harbor Unit");
        seedOrg("RR Sea Foods Central Cold Storage");
        seedOrg("RR Sea Foods Express Fleet");
    }

    private void seedState(String name) {
        long id = stateIdSeq.getAndIncrement();
        states.put(id, new HashMap<>(Map.of("id", id, "statename", name, "status", 1)));
    }

    private void seedDistrict(String name, Long stateId) {
        long id = districtIdSeq.getAndIncrement();
        districts.put(id, new HashMap<>(Map.of("id", id, "districtname", name, "stateid", stateId, "status", 1)));
    }

    private void seedDept(String name) {
        long id = deptIdSeq.getAndIncrement();
        departments.put(id, new HashMap<>(Map.of("id", id, "departmentname", name, "status", 1)));
    }

    private void seedOrg(String name) {
        long id = orgIdSeq.getAndIncrement();
        orgs.put(id, new HashMap<>(Map.of("id", id, "orgname", name, "status", 1)));
    }

    // --- State Master ---
    @GetMapping("/stateMaster")
    public ResponseEntity<List<Map<String, Object>>> getStateMaster() {
        return ResponseEntity.ok(new ArrayList<>(states.values()));
    }

    @PostMapping("/saveState")
    public ResponseEntity<?> saveState(@RequestBody Map<String, Object> data) {
        long id = data.containsKey("id") && data.get("id") != null
                ? Long.parseLong(data.get("id").toString())
                : stateIdSeq.getAndIncrement();
        states.put(id, new HashMap<>(Map.of(
                "id", id,
                "statename", data.getOrDefault("statename", "New State"),
                "status", data.getOrDefault("status", 1)
        )));
        return ResponseEntity.ok(Map.of("message", "State saved successfully"));
    }

    @DeleteMapping("/deleteState/{id}")
    public ResponseEntity<?> deleteState(@PathVariable Long id) {
        states.remove(id);
        return ResponseEntity.ok(Map.of("message", "State deleted successfully"));
    }

    // --- District Master ---
    @GetMapping("/districtMaster")
    public ResponseEntity<List<Map<String, Object>>> getDistrictMaster() {
        return ResponseEntity.ok(new ArrayList<>(districts.values()));
    }

    @PostMapping("/saveDistrict")
    public ResponseEntity<?> saveDistrict(@RequestBody Map<String, Object> data) {
        long id = data.containsKey("id") && data.get("id") != null
                ? Long.parseLong(data.get("id").toString())
                : districtIdSeq.getAndIncrement();
        districts.put(id, new HashMap<>(Map.of(
                "id", id,
                "districtname", data.getOrDefault("districtname", "New District"),
                "stateid", data.getOrDefault("stateid", 1),
                "status", data.getOrDefault("status", 1)
        )));
        return ResponseEntity.ok(Map.of("message", "District saved successfully"));
    }

    // --- Department Master ---
    @GetMapping("/departmentMaster")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentMaster() {
        return ResponseEntity.ok(new ArrayList<>(departments.values()));
    }

    @PostMapping("/saveDepartment")
    public ResponseEntity<?> saveDepartment(@RequestBody Map<String, Object> data) {
        long id = data.containsKey("id") && data.get("id") != null
                ? Long.parseLong(data.get("id").toString())
                : deptIdSeq.getAndIncrement();
        departments.put(id, new HashMap<>(Map.of(
                "id", id,
                "departmentname", data.getOrDefault("departmentname", "New Department"),
                "status", data.getOrDefault("status", 1)
        )));
        return ResponseEntity.ok(Map.of("message", "Department saved successfully"));
    }

    @DeleteMapping("/deleteDepartment/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departments.remove(id);
        return ResponseEntity.ok(Map.of("message", "Department deleted successfully"));
    }

    // --- Organisation Master ---
    @GetMapping("/orgMaster")
    public ResponseEntity<List<Map<String, Object>>> getOrgMaster() {
        return ResponseEntity.ok(new ArrayList<>(orgs.values()));
    }

    @PostMapping("/saveOrg")
    public ResponseEntity<?> saveOrg(@RequestBody Map<String, Object> data) {
        long id = data.containsKey("id") && data.get("id") != null
                ? Long.parseLong(data.get("id").toString())
                : orgIdSeq.getAndIncrement();
        orgs.put(id, new HashMap<>(Map.of(
                "id", id,
                "orgname", data.getOrDefault("orgname", "New Organisation"),
                "status", data.getOrDefault("status", 1)
        )));
        return ResponseEntity.ok(Map.of("message", "Organisation saved successfully"));
    }

    @DeleteMapping("/deleteOrg/{id}")
    public ResponseEntity<?> deleteOrg(@PathVariable Long id) {
        orgs.remove(id);
        return ResponseEntity.ok(Map.of("message", "Organisation deleted successfully"));
    }

    // --- Update Status ---
    @PostMapping("/updatestatus")
    public ResponseEntity<?> updateStatus(
            @RequestParam String tablename,
            @RequestParam Long id,
            @RequestParam Integer status) {
        return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
    }
}

